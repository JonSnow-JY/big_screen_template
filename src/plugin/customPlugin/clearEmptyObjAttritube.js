export default {
  install(Vue) {
    Vue.prototype.$clearEmptyObjAttritube = (obj) => {
      let tempObj = {};
      for (let variable in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, variable)) {
          let temp = obj[variable];
          if (temp !== "" && temp !== null && temp !== undefined) {
            tempObj[variable] = temp;
          }
        }
      }
      return tempObj;
    };
  },
};
