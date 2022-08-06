/**
 * 根据打包指令，设置当前使用的全局变量
 * 区分是使用.env等传统的全局变量还是读取public/config/js/index.js下的全局变量
 */
export const getPublicConfig = ({ key } = {}) => {
  // 判断是否为手动修改的模块
  const isManualConfig = process.env.VUE_APP_IS_MANUAL_CONFIG;
  if (isManualConfig === "1") {
    return config[key];
  } else {
    return process.env[`VUE_APP_${getUpperCase({ str: key })}`];
  }
};

/**
 * 获取大写字母
 * @param  {String} str
 */
const getUpperCase = ({ str }) => {
  const tempArr = str.split("").map((item) => {
    let newItem = item.toUpperCase();
    if (newItem === item) {
      // 之前的大写字母前，拼接上下划线
      newItem = "_" + item;
    }
    return newItem;
  });
  return tempArr.join("");
};
