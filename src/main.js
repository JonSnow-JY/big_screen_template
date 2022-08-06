import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 核心插件
import ele from "@/plugin/ele";

Vue.config.productionTip = false;

// 核心插件
Vue.use(ele);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
