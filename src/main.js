
import Vue from "vue";
import VueRouter from "vue-router";
import "vue-github-buttons/dist/vue-github-buttons.css"
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import RTLPlugin from "./RTLPlugin";
import i18n from "./i18n"

Vue.use(Vuetify);
Vue.config.productionTip = false;

import routes from "./router";

const router = new VueRouter({
  routes,
  linkExactActiveClass: "active"
});

Vue.use(VueRouter);
Vue.use(RTLPlugin);
new Vue({
  router,
  vuetify: new Vuetify(),
  i18n,
  render: h => h(App)
}).$mount("#app");
