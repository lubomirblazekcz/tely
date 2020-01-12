<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <div id="app_nav">
      <div class="wrp_nav_body row--flex">
        <div class="col">
          <router-link to="/dashboard" class="icon icon--home" active-class="state--active"></router-link>
        </div>
        <div class="col">
          <router-link to="/search" class="icon icon--search" active-class="state--active"></router-link>
        </div>
        <div class="col">
          <router-link to="/downloads" class="icon icon--list" active-class="state--active"></router-link>
        </div>
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
body {
  background-color: #000;
  color: #fff;
}

* {
  -webkit-tap-highlight-color:  rgba(255, 255, 255, 0);
  outline: none;
}

h1 {
  margin: 0;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.comp {
  overflow: hidden;
}

.part_ui_icon {
  display: block;
  cursor: pointer;
  background-color: transparent;
  color: #fff;
  border: 0;
  padding: 0;

  &.state--active {
    .icon {
      opacity: 1;
    }
  }

  input {
    opacity: 0;
    z-index: -1;
    position: absolute;
    padding: 0;
    margin: 2px;

    &:checked {
      + .icon {
        opacity: 1;
      }
    }
  }

  .icon {
    opacity: 0.6;
    font-size: 24/16rem;
    &, &:before {
      display: block;
    }
  }
}

#app {
  font-family: 'Poppins', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 5% 5% 60/16rem;
}

#app_nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
  overflow: hidden;

  .wrp_nav_body {
    display: flex;
    flex-direction: row;
    padding: 0 14/16rem;
    justify-content: space-between;
    > .col {
      flex-grow: 1;
    }
  }

  a {
    padding: 18/16rem;
    text-align: center;
    color: #fff;
    font-size: 24/16rem;
    text-decoration: none;

    &.state--active {
      color: #2acd72;
    }

    &:not(.state--active) {
      opacity: 0.7;
    }

    &, &:before {
      display: block;
    }
  }
}
</style>
