<template>
  <div class="comp">
    <div class="wrp_comp_head">
      <h1>Dashboard</h1>
      <div class="elm_comp_type row">
        <div class="col">
          <button @click="toggleUpcoming" class="part_ui_tag" :class="{ 'state--active': type === 'upcoming'}"><span>Upcoming</span></button>
        </div>
        <div class="col">
          <button @click="toggleAired" class="part_ui_tag" :class="{ 'state--active': type === 'aired'}"><span>Aired</span></button>
        </div>
      </div>
    </div>
    <div class="wrp_comp_body" v-if="episodes">
      <div v-for="weekday in episodes" v-bind:key="weekday.id">
        <h2>{{weekday.day}}</h2>
        <div class="elm_item" @click="downloadTorrent" v-for="episode in weekday.episodes" v-bind:key="episode.id" v-bind:data-name="`${episode['seriesName']} s${ (episode['airedSeason']).toLocaleString(undefined, {minimumIntegerDigits: 2}) }e${ (episode['airedEpisodeNumber']).toLocaleString(undefined, {minimumIntegerDigits: 2}) }`">
          <div class="elm_item_name">
            {{ episode["seriesName"] }}
            <span class="icon icon--netflix" v-if=" episode['networkLocal'] === 'netflix' "></span>
            <span class="icon icon--hbo" v-if=" episode['networkLocal'] === 'hbo' "></span>
            <span class="icon icon--amazon" v-if=" episode['networkLocal'] === 'amazon' "></span>
          </div>
          <div class="elm_item_info">
            s{{ (episode["airedSeason"]).toLocaleString(undefined, {minimumIntegerDigits: 2}) }}e{{ (episode["airedEpisodeNumber"]).toLocaleString(undefined, {minimumIntegerDigits: 2}) }},
            {{ episode["firstAiredPlus"] }}
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
  name: 'Dashboard',
  data: () => ({
    episodes: [],
    type: "upcoming"
  }),
  methods: {
    isAired: (date) => {
      let d = new Date();
      d.setDate(d.getDate());

      if (new Date(date) < d) {
        return true
      }
    },
    downloadTorrent: (event) => {
      self.$router.push({ name: 'search', params: { torrentName: event.target.closest('.elm_item').dataset.name }})
    },
    getEpisodes: (status) => {
      self.episodes = [];
      axios.get(`${self.$root.api}/api/tvdb/episodes`, {
        params: {
          status: status
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
    toggleUpcoming: () => {
      self.getEpisodes("upcoming");
      self.type = "upcoming";
    },
    toggleAired: () => {
      self.getEpisodes("aired");
      self.type = "aired";
    }
  },
  mounted () {
    self.getEpisodes("upcoming");
  },
  created () {
    self = this;
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .part_ui_tag {
    border: 1px solid fade(#fff,40%);
    background-color: transparent;
    color: #fff;
    padding: 2/16rem 14/16rem;
    font-size: 13/16rem;
    border-radius: 11/16rem;
    cursor: pointer;

    transition: 0.3s background-color, 0.3s border-color, 0.3s color;

    &.state--active {
      border-color: #2acd72;
      background-color: #2acd72;
      color: #333;
    }

    span {
      display: block;
      line-height: 16/16rem;
      position: relative;
    }
  }

  .wrp_comp_head {
    margin-bottom: 32/16rem;
  }

  .elm_comp_type {
    margin-left: -6/16rem;
    margin-right: -6/16rem;
    margin-top: 8/16rem;
    > .col {
      padding-left: 6/16rem;
      padding-right: 6/16rem;
    }
  }

  .wrp_comp_body {
    h2 {
      font-size: 18/16rem;
      border-bottom: 1px solid fade(#fff, 10%);
      padding-bottom: 6/16rem;
      margin-bottom: 4/16rem;
    }

    .elm_item {
      padding: 8/16rem 0;
      cursor: pointer;
      .elm_item_name {
        font-weight: 500;
        align-items: center;
        display: flex;

        .icon {
          margin-left: 6/16rem;
          &, &:before {
            display: block;
          }
        }
      }

      .elm_item_info {
        color: fade(#fff,70%);
        font-weight: 300;
        font-size: 14/16rem;
      }
    }
  }

</style>
