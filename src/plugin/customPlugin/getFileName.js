export default {
  install(Vue) {
    Vue.prototype.$getFileName = (filePath, type = 0) => {
      if (!filePath) return "";
      const tempArr = filePath.split("/");
      const { length } = tempArr;
      if (!length) return "";
      const res = tempArr[length - 1];
      // type === 1,返回文件名，先简单这样写
      return !type ? res : getFileTextName(res);
    };
  },
};

/**
 * 获取文件名汉字
 */
const getFileTextName = (val) => {
  const arr = val.split(".");
  arr.pop();
  return arr.join(".");
};
