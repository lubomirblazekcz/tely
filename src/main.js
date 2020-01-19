import Config from '../app.config.js';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import Dashboard from "./components/Dashboard";
import Search from "./components/Search";
import Downloads from "./components/Downloads";
import {Plugins} from '@capacitor/core';

const {SplashScreen} = Plugins;

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/dashboard'},
  { path: '/dashboard', component: Dashboard },
  { path: '/search', component: Search,  name: 'search' },
  { path: '/downloads', component: Downloads,  name: 'downloads' }
];

const router = new VueRouter({
  routes // short for `routes: routes`
});

new Vue({
  render: h => h(App),
  router,
  data: {
    api: Config.url
  },
  created: () => {
    SplashScreen.hide();
  }
}).$mount('#app');