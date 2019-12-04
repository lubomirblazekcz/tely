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
<style>
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,700&display=swap&subset=latin-ext');
</style>
<style lang="less">
  body {
    background-color: #000;
    color: #fff;
  }
#app {
  font-family: 'Poppins', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  padding: 2% 5%;
  padding-bottom: 5rem;
}

  .phone-viewport {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;

    background-color: #000;
    div {
      display: flex;
    }
    a {
      width: 100/12*4% !important;
      color: #fff;
      padding: 1rem;
    }
  }
</style>
