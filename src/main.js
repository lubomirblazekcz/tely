import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Dashboard from "./components/Dashboard";
import TorrentsSearch from "./components/TorrentsSearch";
import Torrents from "./components/Torrents";

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Dashboard },
  { path: '/torrents-search', component: TorrentsSearch,  name: 'torrents-search', },
  { path: '/torrents', component: Torrents }
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

new Vue({
  render: h => h(App),
  router,
  data: {
    api: "//192.168.0.94:3000"
  }
}).$mount('#app');
