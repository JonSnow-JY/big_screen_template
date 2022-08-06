import axios from "axios";
import { Message } from "element-ui";
import util from "@/libs/util";
import router from "@/router";
import { getPublicConfig } from "libs/getPublicConfig";
import getBaseUrl from "libs/getBaseUrl";
import store from "@/store/index";

// 创建一个错误
function errorCreate(msg, responseURL) {
  const error = new Error(msg);
  errorLog(error, responseURL);
  throw error;
}

// 返回登录页面
function goLogin() {
  const { path } = router.currentRoute;
  if (path !== "/login") {
    router.replace({
      name: "login",
    });
  }
}

// 记录和显示错误
function errorLog(error, responseURL) {
  // 打印到控制台
  if (process.env.NODE_ENV === "development") {
    util.log.danger(">>>>>> Error >>>>>>");
    console.log(error);
  }

  // 下面这一通条件，判断不弹窗显示报错信息
  const { name } = router.currentRoute;
  if (
    responseURL &&
    responseURL.includes("/gov/item-release/task-release/") &&
    name.startsWith("task-dynamic-table-")
  ) {
    return;
  }

  // 显示提示
  Message({
    message: error.message,
    type: "error",
    duration: process.env.VUE_APP_ELEMENT_MESSAGE_DURING_TIME,
    showClose: true,
  });
}

// 创建一个 axios 实例
// getPublicConfig({ key: 'api' })  =>  取本地配置文件
const service = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "/api" : getBaseUrl(),
  timeout: 30000, // 请求超时时间
});

let resUuid = "";

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在请求发送之前做一些处理
    const token = util.cookies.get("token");
    let { url, method, params } = config;
    if (url !== "sys/login") {
      if (token) {
        config.headers["Authorization"] = token;
        // 在发送请求设置cancel token
        config.cancelToken = new axios.CancelToken((cancel) => {
          store.commit("custom/axios/pushCancel", cancel);
        });
      }
    }
    if (resUuid) {
      // 登录接口添加上uuid
      config.headers["uuid"] = resUuid;
    }
    config.headers["affiliationApp"] = getPublicConfig({
      key: "affiliationApp",
    });
    config.headers["affiliationAppType"] = getPublicConfig({
      key: "affiliationAppType",
    });
    // TODO: 不清楚会不会对其他接口产生影响
    if (method === "get" && params) {
      url += "?";
      let keys = Object.keys(config.params);
      for (let key of keys) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`;
      }
      url = url.substring(0, url.length - 1);
      config.params = {};
    }
    config.url = url;
    return config;
  },
  (error) => {
    // 发送失败
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const {
      headers: { authorization, uuid },
      data: dataAxios,
      request: { responseURL },
    } = response;
    if (authorization) {
      util.cookies.set("token", authorization);
    }
    // 验证码的逻辑处理，登录接口需要用到
    if (uuid) {
      resUuid = uuid;
    }
    const { statusCode, data } = dataAxios;
    switch (statusCode) {
      case 200 || undefined:
        return data;
      case 401:
        goLogin();
        break;
      // 验证码返回数据
      case undefined:
        return dataAxios;
      case 90000:
        return dataAxios;
      default:
        errorCreate(`${dataAxios.msg}`, responseURL);
        break;
    }
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          goLogin();
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求地址出错";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
      }
    }
    if (error.message !== store.state.custom.axios.errorMsg) {
      errorLog(error);
      return Promise.reject(error);
    }
  }
);

export default service;
