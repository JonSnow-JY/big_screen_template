export default {
  install(Vue) {
    Vue.prototype.$createTree = ({
      list,
      code = "code",
      parentCode = "lastCode",
      children = "childList",
    }) => {
      let obj = {};
      list.map((item) => {
        obj[item[code]] = item;
      });
      let arr = [];
      list.map((item) => {
        let parent = obj[item[parentCode]];
        if (parent) {
          (parent[children] || (parent[children] = [])).push(item);
        } else {
          arr.push(item);
        }
      });
      return arr;
    };
  },
};
