// Element
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/reset.css";
// flex 布局库
import "flex.css";
import "assets/sass/index.scss";

import customPlugin from "plugin/customPlugin";
// 功能插件
import pluginError from "@/plugin/error";
const messageDuringTime = process.env.VUE_APP_ELEMENT_MESSAGE_DURING_TIME;

export default {
  async install(Vue) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    Vue.config.productionTip = false;
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV;
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL;
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION;
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME;
    // Element
    Vue.use(ElementUI, { size: "medium" });
    // 重置全局提示默认duration
    Vue.prototype.$message = function (msg) {
      ElementUI.Message({
        ...msg,
        duration: messageDuringTime,
        showClose: true,
      });
    };
    Vue.prototype.$message.success = (msg) =>
      ElementUI.Message.success({
        message: msg,
        duration: messageDuringTime,
        showClose: true,
      });
    Vue.prototype.$message.warning = (msg) =>
      ElementUI.Message.warning({
        message: msg,
        duration: messageDuringTime,
        showClose: true,
      });
    Vue.prototype.$message.error = (msg) =>
      ElementUI.Message.error({
        message: msg,
        duration: messageDuringTime,
        showClose: true,
      });
    // 插件
    Vue.use(pluginError);
    // 自定义插件
    Vue.use(customPlugin);
  },
};
