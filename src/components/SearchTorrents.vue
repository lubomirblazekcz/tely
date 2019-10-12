<template>
  <div class="hello">
    <input type="search" v-on:change="searchTorrents" />
    <div v-for="(torrent, id) in torrents ">
      {{ torrent.title }}
      <button v-on:click="downloadTorrent" v-bind:data-id="id">Stáhnout</button>
    </div>
  </div>
</template>

<script>
let self;

export default {
  name: 'SearchTorrents',
  data: () => ({
    torrents: null
  }),
  methods: {
    searchTorrents: (event) => {
      fetch(`/api/torrents?search=${event.target.value}&quality=1080&category=TV`).then(response => {
        response.json().then(json => {
          self.torrents = json;
        });
      });
    },
    downloadTorrent: (event) => {
      let id = event.target.dataset.id;
      let data = new FormData();

      data.append("urls", self.torrents[id].magnet);

      fetch(`http://app.torrent/qb/api/v2/torrents/add`, {
        method: "POST",
        credentials: 'include',
        body: data
      }).then(response => {
        console.log("downloading")
      });
    }
  },
  mounted () {
    fetch(`/api/torrents?search=supernatural&quality=1080&category=TV`).then(response => {
      response.json().then(json => {
        self.torrents = json;
      });
    });
  },
  created () {
    self = this;
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
