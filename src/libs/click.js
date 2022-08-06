import store from "@/store/index";
export default {
  /**
   * 埋点工具
   */
  buriedPoint({ route } = {}) {
    // 清空数据
    window.aplus_queue = [];
    window.aplus_queue.push({
      action: "aplus.setMetaInfo",
      arguments: ["aplus-rhost-v", "alog.zjzwfw.gov.cn"],
    });
    window.aplus_queue.push({
      action: "aplus.setMetaInfo",
      arguments: ["aplus-rhost-g", "alog.zjzwfw.gov.cn"],
    });

    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

    window.aplus_queue.push({
      action: "aplus.setMetaInfo",
      arguments: ["appId", isAndroid ? "28302650" : isIOS ? "28328447" : "47130293"],
    });
    // 用户信息埋点
    // 如采集用户信息是异步行为需要先执行这个BLOCK埋点
    window.aplus_queue.push({
      action: "aplus.setMetaInfo",
      arguments: ["_hold", "BLOCK"],
    });
    // 基础埋点
    // 单页应用 或 “单个页面”需异步补充PV日志参数还需进行如下埋点：
    window.aplus_queue.push({
      action: "aplus.setMetaInfo",
      arguments: ["aplus-waiting", "MAN"],
    });
    // 单页应用路由切换后 或 在异步获取到pv日志所需的参数后再执行sendPV：
    window.aplus_queue.push({
      action: "aplus.sendPV",
      arguments: [
        {
          is_auto: false,
        },
        {
          // 当前你的应用信息，此两行按应用实际参数修改，不可自定义。
          sapp_id: "9898",
          sapp_name: "xc-report",
          // 自定义PV参数key-value键值对（只能是这种平铺的json，不能做多层嵌套），以下均为必填值
          ...(store.state.d2admin.user.info.name && {
            userName: store.state.d2admin.user.info.name,
          }),
          // 自定义PV参数key-value键值对（只能是这种平铺的json，不能做多层嵌套），如：
          page_id: route.fullPath,
          page_name: route.meta.title,
          page_url: location.href,
        },
      ],
    });
    if (store.state.d2admin.user.info.accountId) {
      // 设置会员ID
      window.aplus_queue.push({
        action: "aplus.setMetaInfo",
        arguments: ["_user_id", store.state.d2admin.user.info.accountId],
      });
    }
    if (store.state.d2admin.user.info.name) {
      // 设置会员昵称
      window.aplus_queue.push({
        action: "aplus.setMetaInfo",
        arguments: ["_user_nick", store.state.d2admin.user.info.name],
      });
    }

    // 如采集用户信息是异步行为，需要先设置完用户信息后再执行这个START埋点
    // 此时被block住的日志会携带上用户信息逐条发出
    window.aplus_queue.push({
      action: "aplus.setMetaInfo",
      arguments: ["_hold", "START"],
    });
  },
};
