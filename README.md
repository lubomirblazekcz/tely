

# <img src="./public/favicons/favicon-32x32.png" alt="Logo"> Tely
This app is small personal project written in Vue.js and Express.js and it's basically a very simplified alternative to Sonarr.<br/>
Keep track of your favorites TV shows in one place from your phone. Uses mix of TVDB, qBittorrent and Plex API's.<br/>
What the app does? Shows you upcoming and aired episodes in one location. You can find releases and send it to qBittorrent client. You can also sync it with Plex.

### What you need
* node.js
* raspberry pi 4 or your pc to host the app
* tvdb account and api key
* qbittorrent
* plex server

### Setup
```sh
npm intall
npm run build
```

## Add all your favorites tv shows to series.json
```json
{
    "id": 268592, // tvdb id
    "name": "The 100", // name
    "status": "continuing",
    "network": "netflix" // if it available on streaming service you have - netflix, amazon, hbomax, disney
}
```

### Config app.config.js
```js
{
    url: "http://192.168.0.94:3000", // local ip of your host
    port: 3000,
    qb: {
        url: "http://192.168.0.94:8090" // local ip of webui qbittorrent client
    },
    tvdb: {
        apikey: "", // tvdb api key
        offset: 8 // timeoffset in hours
    },
    torrent: {
        provider: "1337x"
    },
    plex: {
        token: "", // plex authentication token
        url: "http://192.168.0.220:32400", // local ip of plex server
        library: [1,2], // id of libraries to sync
    }
}
```

### Sync it with plex
In qbittorrent you have to set up post request (`curl http://192.168.0.94:3000/api/torrents-downloaded`) after downloading (settings->downloading in qbittorrent)

### Run the app
```
npm run api
```

You can run the app inside browser or you can also bundle it into native android / ios app via [Capacitor.js](https://capacitor.ionicframework.com/)<br/>
To run the app outside your local network you have to open your local ports.

<img src="./public/dashboard_preview.png" alt="Screenshot" width=260px>

