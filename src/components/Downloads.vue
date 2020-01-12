<template>
  <div class="comp">
    <div class="wrp_comp_head row">
      <div class="col">
        <h1>Downloads</h1>
      </div>
      <div class="col" v-if="torrents_downloading">
        <button class="part_ui_icon" v-if="!torrents_paused" @click="torrentsPause">
          <span class="icon icon--pause"></span>
        </button>
        <button class="part_ui_icon" v-if="torrents_paused" @click="torrentsResume">
          <span class="icon icon--play"></span>
        </button>
      </div>
    </div>
    <div class="wrp_comp_body" v-if="torrents">
      <div class="elm_item" v-for="torrent in torrents" v-bind:key="torrent.id">
        <div class="elm_item_name">
          {{ torrent["name"] }}
        </div>
        <div class="elm_item_info">
          {{ parseInt(torrent["progress"] * 100) }}%
          <template v-if="(torrent['completed'] / 1e+9).toFixed(2) !== (torrent['size'] / 1e+9).toFixed(2)">
            {{ (torrent["completed"] / 1e+9).toFixed(2) }}/{{ (torrent["size"] / 1e+9).toFixed(2) }} GB
          </template>
          <template v-else>
            {{ (torrent["completed"] / 1e+9).toFixed(2) }} GB
          </template>
        </div>
      </div>
    </div>
    <div v-if="torrents_none">
        {{torrents_none}}
    </div>
  </div>
</template>

<script>
let self;
import axios from "axios";

export default {
  name: 'Downloads',
  data: () => ({
    torrents: null,
    torrents_none: null,
    torrents_paused: false,
    torrents_downloading: false
  }),
  methods: {
    torrentsPause: () => {
      axios.post(`${self.$root.api}/api/torrents-pause`).then(function () {
        self.torrents_paused = true
      });
    },
    torrentsResume: () => {
      axios.post(`${self.$root.api}/api/torrents-resume`).then(function () {
        self.torrents_paused = false
      });
    },
    torrentsInfo: () => {
      axios.get(`${self.$root.api}/api/torrents-info`).then(response => {
        if (response.data.length > 0) {
          self.torrents = response.data;

          let downloading = 0;

          response.data.forEach(function(item){
            if (item["progress"] !== 1) {
              downloading ++;
            }
          });

          self.torrents_downloading = downloading > 0;

          self.torrents.sort(function(a, b){return a["progress"] - b["progress"]});
        } else {
          self.torrents_none = "No downloads"
        }
      });
    }
  },
  activated () {
    self.torrentsInfo();
    setInterval(function(){
      self.torrentsInfo();
    },2000);
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
    .part_ui_icon {
      font-size: 30/16rem;
      .icon {
        opacity: 1;
      }
    }
  }

  .wrp_comp_body {
    margin-top: 16/16rem;
  }

  .elm_item {
    padding: 8/16rem 0;

    .elm_item_name {
      font-weight: 500;
      font-size: 14/16rem;

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
