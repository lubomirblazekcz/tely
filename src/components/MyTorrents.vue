<template>
  <div class="layout">
    <md-list class="md-double-line" v-if="torrents">
      <md-list-item v-for="(torrent, id) in torrents ">
        <div class="md-list-item-text">
          <span>{{ torrent["name"] }}</span>
          <span>{{ torrent["progress"] }} {{ torrent["completed"] }}</span>
        </div>
      </md-list-item>
    </md-list>
    <div v-if="torrents_none">
        {{torrents_none}}
    </div>
  </div>
</template>

<script>
let self;
import axios from "axios";

export default {
  name: 'MyTorrents',
  data: () => ({
    torrents: null,
    torrents_none: null
  }),
  mounted () {
    axios.get(`${self.$root.api}/api/torrents-info`).then(response => {
      if (response.data.length > 0) {
        self.torrents = response.data;
      } else {
        self.torrents_none = "No torrents"
      }
    });
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
