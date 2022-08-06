export default {
  install(Vue) {
    Vue.directive("input-init", {
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
            let oldValue = input.value;
            let newValue = input.value.replace(/[^\d]/g, "");
            const func = (type, val) => {
              switch (type) {
                case "zeroBefore":
                  return val; // 数字随意输，不做处理，如 000013
                case "zeroCan":
                  return Number(val).toString(); // 去掉开头0 正整数 + 0
                default:
                  return val.replace(/^\b(0+)/gi, ""); // (默认)去掉开头0 正整数
              }
            };
            if (newValue) {
              if (typeof binding.value === "object") {
                // 限制输入最大值
                const { max, type } = binding.value;
                let val = newValue;
                if (max === undefined) {
                  newValue = func(type, val);
                } else {
                  if (newValue > max) val = max + "";
                  newValue = func(type, val);
                }
              } else {
                newValue = func(binding.value, newValue);
              }
            }
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
