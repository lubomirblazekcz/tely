<template>
  <div class="layout">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-50">
        <div>
          <label>Categry</label>
          <select v-model="category" @change="searchTorrents">
            <option value="tv">TV</option>
            <option value="movies">Movies</option>
          </select>
        </div>
      </div>
      <div class="md-layout-item md-small-size-50">
        <div>
          <label>Quality</label>
          <select v-model="quality" @change="searchTorrents">
            <option value="2160">2160</option>
            <option value="1080">1080</option>
            <option value="720">720</option>
          </select>
        </div>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-80">
        <div>
          <label>Search</label>
          <input class="md-accent" v-model="search_text" v-on:change="searchTorrents" />
        </div>
      </div>
      <div class="md-layout-item md-small-size-20">
        <div>
          <select v-model="count" @change="searchTorrents">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </div>
    <div class="md-double-line" v-if="torrents">
      <div v-for="(torrent, id) in torrents" v-bind:key="torrent.id">
        <div class="md-list-item-text">
          <span>{{ torrent.title }}</span>
          <div><span>{{ torrent.size }}, {{ torrent.time }}</span> <span style="color: #fff;font-size: 12px">{{ torrent.seeds }} / {{ torrent.peers }}</span></div>
        </div>
        <button class="md-icon-button md-list-action" v-on:click="downloadTorrent" v-bind:data-id="id">
          <span class="md-primary">save_alt</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
let self;

import axios from "axios";

export default {
  name: 'TorrentsSearch',
  data: () => ({
    torrents: null,
    category: "tv",
    quality: "1080",
    count: 5,
    search_text: ""
  }),
  methods: {
    searchTorrents: () => {
      if (self.search_text.length > 0) {
        axios.get(`${self.$root.api}/api/torrents?search=${self.search_text}&quality=${self.quality}&category=${self.category}&count=${self.count}`).then(response => {
          self.torrents = response.data;
        });
      }
    },
    downloadTorrent: (event) => {
      let id = event.target.closest('button').dataset.id;

      axios.post(`${self.$root.api}/api/torrents-add`, {
        url: self.torrents[id].magnet
      });
    }
  },
  created () {
    self = this;
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .md-list-action {
    align-self: flex-start;
  }
  .md-list-item-text * {
    overflow: visible;
    text-overflow: initial;
    white-space: normal;
    word-break: break-word;
  }
  .md-list-item-text {
    div {
      display: flex;
      justify-content: space-between;
      span {
        width: auto;
      }
    }
  }
</style>
