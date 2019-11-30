import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import moment from 'moment';
import Dashboard from "./components/Dashboard";
import TorrentsSearch from "./components/TorrentsSearch";
import Torrents from "./components/Torrents";

Vue.use(VueRouter);

console.log(moment(`2019-12-01 8:00 PM`, "YYYY-MM-DD h:m").add(8, 'h').format("DD. MM. YYYY HH:mm"));

const routes = [
  { path: '/', component: Dashboard },
  { path: '/torrents-search', component: TorrentsSearch },
  { path: '/torrents', component: Torrents }
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

new Vue({
  render: h => h(App),
  router,
  data: {
    api: "http://192.168.0.24:3000"
  }
}).$mount('#app');
