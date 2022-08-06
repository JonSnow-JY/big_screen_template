import dayjs from "dayjs";

export default {
  install(Vue) {
    Vue.prototype.$timeFormat = (val, type = "YYYY-MM-DD", emptyTedxt = "--") => {
      return val ? dayjs(val).format(type) : emptyTedxt;
    };
  },
};
