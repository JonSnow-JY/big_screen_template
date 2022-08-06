import { isObject } from "lodash";
export default {
  install(Vue) {
    Vue.directive("input-float", {
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
            let newValue = input.value;
            newValue = newValue.replace(/[^\d.]/g, "");
            newValue = newValue.replace(/^\./g, "");
            newValue = newValue.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            let decimal = 2; // 默认两位小数
            let maxNum = 0;
            let minNum = 0;
            if (isObject(binding.value)) {
              const { value = 2, max, min } = binding.value;
              decimal = Number(value);
              if (max) {
                maxNum = Number(max);
              }
              if (min) {
                minNum = Number(min);
              }
            }
            const reg = new RegExp(`^(\\-)*(\\d+)\\.(\\d{${decimal}}).*$`);
            newValue = newValue.replace(reg, "$1$2.$3");
            if (newValue) {
              let arr = newValue.split(".");
              newValue = Number(arr[0]) + (arr[1] === undefined ? "" : "." + arr[1]); // 去掉开头多余的0
              // 设置最大值
              if (maxNum && newValue > maxNum) {
                newValue = Number(maxNum);
              }
              // 设置最小值
              if (minNum && newValue < minNum) {
                newValue = Number(minNum);
              }
            }
            // 判断是否需要更新，避免进入死循环
            if (newValue !== oldValue) {
              input.value = newValue;
              input.dispatchEvent(new Event("input")); // 通知v-model更新
            }
          },
          true
        );
        // input 事件无法处理小数点后面全是零的情况 因为无法确定用户输入的0是否真的应该清除，如3.02。放在blur中去处理
        input.addEventListener("blur", () => {
          let oldValue = input.value;
          let newValue = input.value;
          if (newValue) {
            newValue = Number(newValue).toString();
          }
          // 判断是否需要更新，避免进入死循环
          if (newValue !== oldValue) {
            input.value = newValue;
            input.dispatchEvent(new Event("input")); // 通知v-model更新
          }
        });
      },
    });
  },
};
