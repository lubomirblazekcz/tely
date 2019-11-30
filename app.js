const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const TorrentSearchApi = require('torrent-search-api');
const axios = require('axios');
const app = express();
const port = 3000;
const qb_url = "http://192.168.0.24:8090";
const series = JSON.parse(fs.readFileSync("series.json").toString());

let tvdb = {
  api: "https://api.thetvdb.com",
  token: "",
  series: [],
  episodes: []
};

(async function(){
  await axios.post(`${tvdb.api}/login`, {
    apikey: ''
  }).then(function (response) {
    tvdb.token = response.data.token;
  });
})();

TorrentSearchApi.enableProvider('1337x');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
};


app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', express.static('dist'));

app.get('/api/torrents', (req, res) => {
  (async function(){
    let search = req.query.search;
    let quality = req.query.quality;
    let category = req.query.category;
    let count = req.query.count;

    let torrents = await TorrentSearchApi.search(`${search} ${quality}`, category, count);
    let response = [];


    const start = async () => {
      await asyncForEach(torrents, async (torrent) => {
        const magnet = await TorrentSearchApi.getMagnet(torrent);
        response.push(Object.assign(torrent, {magnet}));
      });
    };

    start().then(function(e){
      res.send(response);
    });
  })();
});

app.get('/api/torrents-info', (req, res) => {
  axios.get(`${qb_url}/api/v2/torrents/info`).then(response => {
    res.send(response.data);
  });
});

app.post('/api/torrents-add', (req, res) => {
  axios({
    method: 'post',
    url: `${qb_url}/api/v2/torrents/add`,
    data: `urls=${req.body.url}`,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
  res.send("ok");
});

const getSeries = async (res) => {
  await asyncForEach(series, async (key) => {
    await axios({
      method: 'get',
      url: `${tvdb.api}/series/${key.id}`,
      headers: {
        'Authorization': `Bearer ${tvdb.token}`
      }
    }).then(response => {
      series.forEach(function(series){
        if (series["id"] === response.data.data["id"]) {
          tvdb.series.push(Object.assign(response.data.data, {
            "networkLocal": series["network"]
          }));
        }
      });
    }).catch(function (error) {
      res.status(500);
      res.send(error);
    });
  });
};

app.get('/api/tvdb/series', (req, res) => {
  (async function(){
    if (tvdb.series.length > 0) {
      res.send(tvdb.series);
    } else {
      getSeries(res).then(function(){
        res.send(tvdb.series);
      });
    }
  })();
});

app.get('/api/tvdb/episodes', (req, res) => {
  (async function(){
    let upcoming = true;
    let aired = req.query.aired;

    function sendEpisodes() {
      let episodes = [];

      tvdb.episodes.forEach(function(child) {
        child.forEach(function(episode){

          let d = new Date();

          const pushEpisode = () => {

            tvdb.series.forEach(function(series){
              if (series["id"] === episode["seriesId"]) {
                episodes.push(Object.assign(episode, {
                  "seriesName": series["seriesName"],
                  "network": series["network"],
                  "networkLocal": series["networkLocal"],
                  "airsTime": series["airsTime"]
                }));
              }
            });
          };

          if (typeof upcoming !== "undefined") {
            d.setDate(d.getDate()-1);

            if (new Date(episode["firstAired"]) > d) {
              pushEpisode();
            }
          } else if (typeof aired !== "undefined") {
            d.setDate(d.getDate()-1);

            if (new Date(episode["firstAired"]) < d) {
              pushEpisode();
            }
          } else {
            pushEpisode();
          }
        });
      });

      episodes.sort(function(a,b){
        return new Date(a["firstAired"]) - new Date(b["firstAired"]);
      });

      res.send(episodes);
    }

    if (tvdb.episodes.length > 0) {
      sendEpisodes();
    } else {
      const getEpisodes = async () => {
        await asyncForEach(tvdb.series, async (key) => {
          await axios({
            method: 'get',
            url: `${tvdb.api}/series/${key["id"]}/episodes/query`,
            params: {
              airedSeason: key["season"]
            },
            headers: {
              'Authorization': `Bearer ${tvdb.token}`
            }
          }).then(response => {
            tvdb.episodes.push(response.data.data);
          }).catch(function (error) {
            res.status(500);
            res.send(error);
          });
        });
      };

      if (tvdb.series.length > 0) {
        getEpisodes().then(function(){
          sendEpisodes();
        });
      } else {
        getSeries(res).then(function(){
          getEpisodes().then(function(){
            sendEpisodes();
          });
        });
      }
    }
  })();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// purge tvdb cache and refresh token after 1 day
setInterval(function(){
  tvdb.episodes = [];

  axios({
    method: 'get',
    url: `${tvdb.api}/refresh_token`,
    headers: {
      'Authorization': `Bearer ${tvdb.token}`
    }
  }).then(response => {
    tvdb.token = response.data.token;
  });
}, 82800000);