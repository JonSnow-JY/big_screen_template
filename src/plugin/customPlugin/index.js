// 全局方法
const files = require.context(".", false, /\.js$/);

export default {
  // 注册
  install(Vue) {
    files.keys().forEach((key) => {
      if (key !== "./index.js") {
        Vue.use(files(key).default);
      }
    });
  },
};
