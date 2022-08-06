import router from "router";
import { isArray, isString } from "lodash";

export default {
  install(Vue) {
    Vue.directive("has", {
      bind: function (el, binding) {
        Vue.nextTick(() => {
          const val = Vue.prototype.$_has(binding.value);
          !val && el.parentNode.removeChild(el);
        });
      },
    });

    // 单个字段判断
    Vue.prototype.$_has = (value) => {
      const { btnPermissionList } = router.app._route.meta;
      if (!isString(value) || !btnPermissionList || !btnPermissionList.length || !value) {
        return false;
      }
      return btnPermissionList.includes(value);
    };

    // 多个字段判断，是否包含其中一个
    Vue.prototype.$_has_one_in_many = (value) => {
      const { btnPermissionList } = router.app._route.meta;
      if (
        !isArray(value) ||
        !value.length ||
        !btnPermissionList ||
        !btnPermissionList.length ||
        !value
      ) {
        return false;
      }
      let flag = 0;
      value.map((item) => {
        btnPermissionList.includes(item) && flag++;
      });
      return !!flag;
    };
  },
};
