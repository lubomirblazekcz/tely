const proxy = require('express-http-proxy');
const express = require('express');
const TorrentSearchApi = require('torrent-search-api');
const app = express();
const port = 3000;


TorrentSearchApi.enableProvider('1337x');

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
};

app.use('/qb/', proxy('192.168.0.24:8090'));
app.use('/', express.static('dist'));

app.get('/api/torrents', (req, res) => {
  (async function(){
    let search = req.query.search;
    let quality = req.query.quality;
    let category = req.query.category;

    let torrents = await TorrentSearchApi.search(`${search} ${quality}`, category, 5);
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));