/**
 * 正则验证规则
 */

/* eslint-disable */
// 网址
const urlReg =
  /(http|ftp|https|rtmp):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/; //这个正则无法匹配localhost，其余的目前来看都是好的

// 数字
const numReg = /^[\-0-9][0-9]*(.[0-9]+)?$/;

// 汉字
const textReg = /^[\u4e00-\u9fa5]+$/;

// 只能输入英文、下划线的
const englishAndLinetReg = /^([A-Za-z]+[_]{0,2}[A-Za-z]*)+$/;

/* eslint-enable */

// 网址
export const websiteValidate = (val) => {
  return urlReg.test(val);
};

// 数字
export const numValidate = (val) => {
  return numReg.test(val);
};

// 汉字
export const textValidate = (val) => {
  return textReg.test(val);
};

// 只能输入英文、下划线的
export const englishAndLinetValidate = (val) => {
  return englishAndLinetReg.test(val);
};
