import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import { MdLayout, MdButton, MdContent, MdField, MdList, MdDivider, MdMenu, MdBottomBar } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css'
import SearchTorrents from "./components/SearchTorrents";
import MyTorrents from "./components/MyTorrents";

Vue.use(VueRouter);
Vue.use(MdLayout);
Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdField);
Vue.use(MdList);
Vue.use(MdMenu);
Vue.use(MdDivider);
Vue.use(MdBottomBar);

const routes = [
  { path: '/', component: SearchTorrents },
  { path: '/torrents', component: MyTorrents }
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
