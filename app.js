const config = require('./app.config.js');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const TorrentSearchApi = require('torrent-search-api');
const axios = require('axios');
const dayjs = require('dayjs');
const app = express();
const port = config.port;
const qb_url = config.qb.url;
const series = JSON.parse(fs.readFileSync("series.json").toString());

let tvdb = {
  api: "https://api.thetvdb.com",
  token: "",
  series: [],
  episodes: []
};

(async function(){
  await axios.post(`${tvdb.api}/login`, {
    apikey: config.tvdb.apikey
  }).then(function (response) {
    tvdb.token = response.data.token;
  });
})();

TorrentSearchApi.enableProvider(config.torrent.provider);

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

app.get('/api/torrents-downloaded', (req, res) => {
  axios.post(`${config.plex.url}/library/sections/${config.plex.library}/refresh?force=1&X-Plex-Token=${config.plex.token}`)
  res.send("ok");
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

app.post('/api/torrents-pause', (req, res) => {
  axios({
    method: 'post',
    url: `${qb_url}/api/v2/torrents/pause`,
    data: `all`,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  });
  res.send("ok");
});

app.post('/api/torrents-resume', (req, res) => {
  axios({
    method: 'post',
    url: `${qb_url}/api/v2/torrents/resume`,
    data: `all`,
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
    let status = "upcoming";

    if (typeof req.query.status !== "undefined") {
      status = req.query.status;
    }

    function sendEpisodes() {
      let episodes = [];

      tvdb.episodes.forEach(function(child) {
        child.forEach(function(episode) {

          let d = new Date();

          const pushEpisode = () => {

            tvdb.series.forEach(function(series){
              if (series["id"] === episode["seriesId"]) {
                episodes.push(Object.assign(episode, {
                  "seriesName": series["seriesName"],
                  "network": series["network"],
                  "networkLocal": series["networkLocal"],
                  "airsTime": series["airsTime"],
                  "firstAiredPlus": dayjs(new Date((`${episode["firstAired"]} ${series["airsTime"]}`).replace(/-/g,"/"))).add(config.tvdb.offset, 'h').format("YYYY-MM-DD"),
                  "airedSeasonEpisode": `s${(episode["airedSeason"].toString()).padStart(2, '0')}e${(episode["airedEpisodeNumber"].toString()).padStart(2, '0')}`
                }));
              }
            });
          };

          if (status === "upcoming") {
            d.setDate(d.getDate()-2);

            if (new Date(episode["firstAired"]) > d) {
              pushEpisode();
            }
          } else if (status === "aired") {
            d.setDate(d.getDate()-2);

            if (new Date(episode["firstAired"]) < d) {
              pushEpisode();
            }
          } else {
            pushEpisode();
          }
        });
      });

      if (status === "aired") {
        episodes.sort(function(a,b){
          return new Date(b["firstAired"]) - new Date(a["firstAired"]);
        });
      } else {
        episodes.sort(function(a,b){
          return new Date(a["firstAired"]) - new Date(b["firstAired"]);
        });
      }

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
            if (response.status === 200) {
              tvdb.episodes.push(response.data.data);
            }
          }).catch(function (error) {
            console.log(error)
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

app.listen(port, () => console.log(`Tely app listening on port ${port}!`));

// purge tvdb cache and refresh token after 1 day
setInterval(function(){
  if (tvdb.token.length > 0) {
    // tvdb.episodes = [];

    axios({
      method: 'get',
      url: `${tvdb.api}/refresh_token`,
      headers: {
        'Authorization': `Bearer ${tvdb.token}`
      }
    }).then(response => {
      tvdb.token = response.data.token;
    });
  }
}, 82800000);