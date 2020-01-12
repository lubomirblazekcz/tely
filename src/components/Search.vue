<template>
  <div class="layout">
    <div class="wrp_comp_head row">
      <div class="col">
        <h1>Search</h1>
      </div>
      <div class="col">
        <div class="row">
          <div class="col">
            <label class="part_ui_icon">
              <input type="radio" v-model="category" value="tv" @change="searchTorrents" />
              <span class="icon icon--tv"></span>
            </label>
          </div>
          <div class="col">
            <label class="part_ui_icon">
              <input type="radio" v-model="category" value="movies" @change="searchTorrents" />
              <span class="icon icon--movies"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="wrp_comp_body">
      <div class="elm_comp_search">
        <input v-model.lazy="search_text" v-on:change="searchTorrents" />
        <span class="icon icon--search"></span>
        <div class="row">
          <div class="col">
            <label class="part_ui_icon">
              <input type="radio" v-model="quality" value="720" @change="searchTorrents" />
              <span class="icon icon--hq"></span>
            </label>
          </div>
          <div class="col">
            <label class="part_ui_icon">
              <input type="radio" v-model="quality" value="1080" @change="searchTorrents" />
              <span class="icon icon--hd"></span>
            </label>
          </div>
          <div class="col">
            <label class="part_ui_icon">
              <input type="radio" v-model="quality" value="2160" @change="searchTorrents" />
              <span class="icon icon--4k"></span>
            </label>
          </div>
        </div>
      </div>
      <div class="elm_comp_results is--empty" v-if="!torrents && !loading">
        No results found
      </div>
      <div class="elm_comp_results is--loading" v-if="loading">
        <div class="loading"></div>
      </div>
      <div class="elm_comp_results" v-if="torrents">
        <div class="elm_item" v-for="(torrent, id) in torrents" v-bind:key="torrent.id">
          <div class="elm_item_name">
            <span>{{ torrent.title }}</span>
            <button class="part_ui_icon state--active" v-on:click="downloadTorrent" v-bind:data-id="id">
              <span class="icon icon--save"></span>
            </button>
          </div>
          <div class="elm_item_info">
            <span>{{ torrent.size }}, {{ torrent.time }}</span> <span style="color: #fff;font-size: 12px">{{ torrent.seeds }} / {{ torrent.peers }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let self;

import axios from "axios";

export default {
  name: 'Search',
  data: () => ({
    torrents: null,
    category: "tv",
    quality: "1080",
    count: 100,
    search_text: "",
    loading: false
  }),
  methods: {
    searchTorrents: () => {
      if (self.search_text.length > 0) {
        self.loading = true;
        axios.get(`${self.$root.api}/api/torrents?search=${self.search_text}&quality=${self.quality}&category=${self.category}&count=${self.count}`).then(response => {
          if (response.data.length > 0) {
            self.torrents = response.data;
          } else {
            self.torrents = null
          }
          self.loading = false;
        });
      }
    },
    downloadTorrent: (event) => {
      let id = event.target.closest('button').dataset.id;

      axios.post(`${self.$root.api}/api/torrents-add`, {
        url: self.torrents[id].magnet
      }).then(function () {
        self.$router.push({ name: 'downloads'})
      });
    }
  },
  activated() {
    if (typeof self.$route.params.torrentName !== "undefined") {
      self.search_text = self.$route.params.torrentName;
      self.torrents = null;
      self.searchTorrents();
    }
  },
  created () {
    self = this;
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .wrp_comp_head {
    justify-content: space-between;

    .row > {
      .col {
        padding-left: 8/16rem;
      }
    }
  }

  .elm_comp_search {
    position: relative;
    margin-top: 16/16rem;

    input {
      width: 100%;
      background-color: tint(#000,20%);
      border: 0;
      height: 40/16rem;
      border-radius: 20/16rem;
      padding: 4/16rem 96/16rem 4/16rem 48/16rem;
      color: #fff;
      box-sizing: border-box;
    }

    > .icon {
      position: absolute;
      left: 12/16rem;
      top: 9/16rem;
      font-size: 24/16rem;
    }

    .row {
      position: absolute;
      right: 16/16rem;
      top: 9/16rem;
    }
  }

  .elm_comp_results {
    margin-top: 32/16rem ;

    &.is--empty {
      text-align: center;
    }

    &.is--loading {
      padding: 12/16rem 8/16rem;
    }

    .loading {
      width: 100%;
      height: 4/16rem;
      border-radius: 2/16rem;
      background-color: fade(#fff,20%);
      position: relative;
      overflow: hidden;

      &:before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        content: "";
        width: 100%;
        border-radius: 2/16rem;
        background-color: #2acd72;
        animation: loading 1s infinite;
        transform: translateX(-100%);
      }
    }
  }

  @keyframes loading {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .elm_item {
    padding: 8/16rem 0;
    cursor: pointer;

    .elm_item_name {
      font-weight: 500;
      align-items: flex-start;
      display: flex;
      font-size: 14/16rem;
      justify-content: space-between;

      .part_ui_icon {
        margin-left: 16/16rem;
        position: relative;
        left: 2px;
        padding-bottom: 8/16rem;
      }

      * {
        overflow: visible;
        text-overflow: initial;
        white-space: normal;
        word-break: break-word;
      }
    }

    .elm_item_info {
      color: fade(#fff,70%);
      font-weight: 300;
      font-size: 14/16rem;
      display: flex;
      justify-content: space-between;
      span {
        width: auto;
      }
    }
  }
</style>
