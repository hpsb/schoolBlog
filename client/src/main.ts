import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import VueCompositionApi from "@vue/composition-api";
import "@/config/toasted";
import "@/config/progressBar";
import "@/config/fontAwesome";

Vue.config.productionTip = false;

Vue.use(VueCompositionApi);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
