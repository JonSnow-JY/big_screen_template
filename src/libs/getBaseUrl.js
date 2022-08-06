import { getPublicConfig } from "libs/getPublicConfig";

/**
 * 获取接口请求链接
 * 如果VUE_APP_API配置了http、https之类的，就直接取
 * 没有，则取访问的链接地址
 * type传ws，则获取ws地址
 */
export default (type = "http") => {
  const baseApi = getPublicConfig({
    key: "api",
  });
  let str = location.href.split("/").splice(0, 3).join("/");
  let res = `${baseApi.includes("http") ? "" : str}${baseApi}`;
  if (type === "ws") {
    let str = res.startsWith("https") ? "wss" : "ws";
    res = str + "://" + res.split("//")[1];
  }
  return res;
};
