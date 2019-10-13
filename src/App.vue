<template>
  <div id="app">
    <h1>Torrent manager</h1>
    <router-view></router-view>
    <div class="phone-viewport">
      <md-bottom-bar md-type="shift" md-sync-route>
        <md-bottom-bar-item to="/" exact md-label="Search" md-icon="search"></md-bottom-bar-item>
        <md-bottom-bar-item to="/torrents" md-label="Torrents" md-icon="pages"></md-bottom-bar-item>
      </md-bottom-bar>
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
