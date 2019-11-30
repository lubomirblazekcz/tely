<template>
  <div class="layout">
    <div class="md-double-line" v-if="episodes">
      <div v-for="weekday in episodes" v-bind:key="weekday.id">
        <div>{{weekday.day}}</div>
        <div v-for="episode in weekday.episodes" v-bind:key="episode.id">
          <span>{{ episode["seriesName"] }}, s{{ (episode["airedSeason"]).toLocaleString(undefined, {minimumIntegerDigits: 2}) }}e{{ (episode["airedEpisodeNumber"]).toLocaleString(undefined, {minimumIntegerDigits: 2}) }}, {{ episode["firstAired"] }}, {{ episode["networkLocal"] }}</span>
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
          if (new Date(episode["firstAired"]).getDay() === i) {
            if (!days.includes(episode["firstAired"])) {
              self.episodes.push({
                "firstAired": episode["firstAired"],
                "day": day,
                "episodes": [episode]
              });
              days.push(episode["firstAired"]);
            } else {
              self.episodes[days.indexOf(episode["firstAired"])].episodes.push(episode);
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
