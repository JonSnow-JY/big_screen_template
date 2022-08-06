export default {
  install(Vue) {
    Vue.directive("input-special", {
      bind(el, binding, vnode) {
        let input = vnode.elm;
        if (input.tagName !== "INPUT") {
          input = input.querySelector("input");
        }
        if (!input) return;
        input.addEventListener("compositionstart", () => {
          vnode.inputLocking = true;
        });
        input.addEventListener("compositionend", () => {
          vnode.inputLocking = false;
          input.dispatchEvent(new Event("input"));
        });
        input.addEventListener(
          "input",
          (e) => {
            e.preventDefault(); // 阻止掉默认的change事件
            if (vnode.inputLocking) {
              return;
            }
            const oldValue = input.value;
            const newValue = input.value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
            // 判断是否需要更新，避免进入死循环
            if (newValue !== oldValue) {
              input.value = newValue;
              input.dispatchEvent(new Event("input")); // 通知v-model更新 vue底层双向绑定实现的原理是基于监听input事件
              input.dispatchEvent(new Event("change")); // 手动触发change事件
            }
          },
          true // 在捕获阶段处理，目的是赶在change事件之前阻止change事件(非法输入在触发指令之前先触发了change，需要干掉)
        );
      },
    });
  },
};
