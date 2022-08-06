import { isArray } from "lodash";

export default {
  install(Vue) {
    /**
     * 从列表中获取汉字
     */
    Vue.prototype.$getTextFromArr = ({ value, arr, valueName = "value", keyName = "name" }) => {
      if (!arr.length) return "";
      if (isArray(value)) {
        const tempArr = arr
          .filter((item) => value.includes(item[valueName]))
          .map((item) => item[keyName]);
        if (!tempArr.length) return "";
        return tempArr.join();
      } else {
        const obj = arr.find((item) => item[valueName] === value);
        if (!obj) return "";
        return obj[keyName];
      }
    };
  },
};
