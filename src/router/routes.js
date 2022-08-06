const _import = require("@/libs/util.import." + process.env.NODE_ENV);

export default [
  {
    path: "/",
    name: "HomeView",
    component: _import("HomeView"),
  },
  {
    path: "/",
    name: "AboutView",
    component: _import("AboutView"),
  },
];
