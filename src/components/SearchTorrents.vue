<template>
  <div class="layout">
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-50">
        <md-field>
          <label>Categry</label>
          <md-select v-model="category" @md-selected="searchTorrents">
            <md-option value="tv">TV</md-option>
            <md-option value="movies">Movies</md-option>
          </md-select>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-50">
        <md-field>
          <label>Quality</label>
          <md-select v-model="quality" @md-selected="searchTorrents">
            <md-option value="2160">2160</md-option>
            <md-option value="1080">1080</md-option>
            <md-option value="720">720</md-option>
          </md-select>
        </md-field>
      </div>
    </div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-small-size-80">
        <md-field>
          <label>Search</label>
          <md-input class="md-accent" v-model="search_text" v-on:change="searchTorrents"></md-input>
        </md-field>
      </div>
      <div class="md-layout-item md-small-size-20">
        <md-field>
          <md-select v-model="count" @md-selected="searchTorrents">
            <md-option value="5">5</md-option>
            <md-option value="10">10</md-option>
            <md-option value="10">20</md-option>
          </md-select>
        </md-field>
      </div>
    </div>
    <md-list class="md-double-line" v-if="torrents">
      <md-list-item v-for="(torrent, id) in torrents ">
        <div class="md-list-item-text">
          <span>{{ torrent.title }}</span>
          <div><span>{{ torrent.size }}, {{ torrent.time }}</span> <span style="color: #fff;font-size: 12px">{{ torrent.seeds }} / {{ torrent.peers }}</span></div>
        </div>
        <md-button class="md-icon-button md-list-action" v-on:click="downloadTorrent" v-bind:data-id="id">
          <md-icon class="md-primary">save_alt</md-icon>
        </md-button>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
let self;

import axios from "axios";

export default {
  name: 'SearchTorrents',
  data: () => ({
    torrents: null,
    category: "tv",
    quality: "1080",
    count: 5,
    search_text: ""
  }),
  methods: {
    searchTorrents: (event) => {
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
