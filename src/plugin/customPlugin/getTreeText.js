export default {
  install(Vue) {
    /**
     * 获取树汉字
     */
    Vue.prototype.$getTreeText = ({ value }) => {
      if (!value) return "";
      const arr = JSON.parse(value);
      return arr.map((item) => item.name).join();
    };
  },
};
