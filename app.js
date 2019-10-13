const express = require('express');
const bodyParser = require('body-parser');
const TorrentSearchApi = require('torrent-search-api');
const axios = require('axios');
const app = express();
const port = 3000;
const qb_url = "http://192.168.0.24:8090";


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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));