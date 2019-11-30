<template>
  <div id="app">
    <h1>Torrent manager</h1>
    <router-view></router-view>
    <div class="phone-viewport">
      <div>
        <router-link to="/">Home</router-link>
        <router-link to="/torrents-search">Search</router-link>
        <router-link to="/torrents">Torrents</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 5%;
  padding-bottom: 5rem;
}

  .phone-viewport {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    .md-bottom-bar-item {
      width: 100/12*6% !important;
      min-width: 100/12*6% !important;
      max-width: 100/12*6% !important;
    }
  }
</style>
