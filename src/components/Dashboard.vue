<template>
  <div class="layout">
    <div class="md-double-line" v-if="episodes">
      <div v-for="weekday in episodes" v-bind:key="weekday.id">
        <div>{{weekday.day}}</div>
        <div v-for="episode in weekday.episodes" v-bind:key="episode.id" v-bind:data-name="`${episode['seriesName']} s${ (episode['airedSeason']).toLocaleString(undefined, {minimumIntegerDigits: 2}) }e${ (episode['airedEpisodeNumber']).toLocaleString(undefined, {minimumIntegerDigits: 2}) }`">
          <span>{{ episode["seriesName"] }}, s{{ (episode["airedSeason"]).toLocaleString(undefined, {minimumIntegerDigits: 2}) }}e{{ (episode["airedEpisodeNumber"]).toLocaleString(undefined, {minimumIntegerDigits: 2}) }}, {{ episode["firstAiredPlus"] }}, {{ episode["networkLocal"] }}</span>
          <button @click="downloadTorrent">download</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let self;
import axios from "axios";

export default {
  name: 'Dashboard',
  data: () => ({
    episodes: []
  }),
  methods: {
    downloadTorrent: (event) => {
      self.$router.push({ name: 'torrents-search', params: { torrentName: event.target.closest('div').dataset.name }})
    }
  },
  mounted () {
    axios.get(`${self.$root.api}/api/tvdb/episodes`, {
      params: {
        status: "upcoming"
      }
    }).then(response => {
      let daysOfWeek = ["Neděle","Pondělí","Úterý","Středa","Čtvrtek","Pátek","Sobota"];
      let days = [];

      response.data.forEach(function(episode) {
        daysOfWeek.forEach(function(day,i) {
          if (new Date(episode["firstAiredPlus"]).getDay() === i) {
            if (!days.includes(episode["firstAiredPlus"])) {
              self.episodes.push({
                "day": day,
                "episodes": [episode]
              });
              days.push(episode["firstAiredPlus"]);
            } else {
              self.episodes[days.indexOf(episode["firstAiredPlus"])].episodes.push(episode);
            }
          }
        });
      });

      self.episodes.forEach(function(weekday){
        weekday.episodes.sort((a, b) => a["airedSeasonEpisode"].localeCompare(b["airedSeasonEpisode"]));
      });
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
