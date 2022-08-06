import cookies from "./util.cookies";
import log from "./util.log";

import store from "@/store/index";

const util = {
  cookies,
  log,
};

/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  window.document.title = `${store.state.d2admin.sysConfig.info.systemName || ""}${
    titleText ? ` | ${titleText}` : ""
  }`;
};

/**
 * @description 获取地址栏参数
 * @param {String} name 参数key值
 */
util.getAddrPro = function (name) {
  return (
    decodeURIComponent(
      (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(location.href) || [
        "",
        "",
      ])[1].replace(/\+/g, "%20")
    ) || null
  );
};

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = (url, type = "_blank") => {
  var a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("target", type);
  a.setAttribute("id", "d2admin-link-temp");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(document.getElementById("d2admin-link-temp"));
};

export default util;
