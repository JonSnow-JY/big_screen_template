import Vue from "vue";
import VueRouter from "vue-router";
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: () => _import("HomeView"),
  },
  {
    path: "/",
    name: "AboutView",
    component: () => _import("AboutView"),
  },
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
