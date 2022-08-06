// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require("@/libs/util.import." + process.env.NODE_ENV);

export function setRouterComponent(routerArr) {
  routerArr.map((item) => {
    let { componentPath, children } = item;

    if (componentPath === "layoutHeaderAside") {
      item.component = () => import("@/layout/header-aside");
    } else {
      try {
        item.component = _import(componentPath);
      } catch (e) {
        console.log(`路由文件：${componentPath}丢失，请检查`);
      }
    }
    if (children && children.length) {
      setRouterComponent(children);
    }
  });
  return routerArr;
}
