export default {
  install(Vue) {
    /**
     * @param  {String}  text
     * @param  {Boolean} [customFlag=false]  [有些自定义的提示文案，需要传true进来]
     */
    Vue.prototype.$myConfirm = (text, customFlag = false) => {
      return new Promise((resolve) => {
        Vue.prototype
          .$confirm(`${customFlag ? "" : "确定要"}${text}吗?`, "系统提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            // 使用html渲染
            dangerouslyUseHTMLString: true,
            type: "warning",
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            // 跳出当前执行区域
          });
      });
    };
  },
};
