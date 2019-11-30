<template>
  <div class="layout">
    <div class="md-double-line" v-if="torrents">
      <div v-for="torrent in torrents" v-bind:key="torrent.id">
        <div class="md-list-item-text">
          <span>{{ torrent["name"] }}</span>
          <span>{{ torrent["progress"] }} {{ torrent["completed"] }}</span>
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
  name: 'Torrents',
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
