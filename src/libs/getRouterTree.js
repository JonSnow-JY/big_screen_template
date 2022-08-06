export default ({ routerData, vm }) => {
  // 获取按钮权限配置
  const btnPermsObj = getBtnPermsObj(routerData);
  // 过滤出0=>路由,1=>菜单,5=>外部链接(iframe=>框架内部显示),并做排序
  const usedRouterData = routerData
    .filter(
      (item) =>
        item.type === "0" ||
        item.type === "1" ||
        (item.type === "5" && item.parentId !== 0 && item.perms === "iframe")
    )
    .sort((a, b) => a.sortBy - b.sortBy);
  // 设置路由数据
  const formatedRouterData = usedRouterData.map((item) => {
    const { parentId, url, name, id, type, perms, icon } = item;
    if (parentId === 0) {
      item.componentPath = "layoutHeaderAside";
      if (type === "5") {
        // 内部跳转链接
        item.path = `/iframe-${id}`;
        item.name = `iframe-${id}`;
        item.meta = { src: url, title: name };
      } else {
        let tempName = url.replace("/", "");
        if (url === "/dynamic") {
          item.path = url + `-${id}`;
          item.name = tempName + `-${id}`;
        } else {
          item.path = url;
          item.name = tempName;
        }
        item.redirect = {};
      }
    } else {
      const simpleMeta = {
        title: name,
        isAuth: true,
      };
      const btnPermissionList = btnPermsObj[id] || [];
      const matchDynamicTable = url.match(/^\/dynamic\/table\?itemCode=(.+?)$/);
      const matchDynamicTableDetail = url.match(/^\/dynamic\/detail\?itemCode=(.+?)$/);
      if (type === "5") {
        // 外部链接
        item.path = `/iframe-${id}`;
        item.name = `iframe-${id}`;
        item.componentPath = "iframe";
        if (perms === "iframe") {
          item.meta = { ...simpleMeta, src: url };
        }
      } else if (matchDynamicTable) {
        // 动态表单列表
        item.path = "/dynamic/table";
        item.name = `dynamic-table-${matchDynamicTable[1]}`;
        item.componentPath = "dynamic/table";
        item.meta = simpleMeta;
      } else if (matchDynamicTableDetail) {
        // 动态表单详情
        item.path = "/dynamic/detail";
        item.name = `dynamic-detail-${matchDynamicTableDetail[1]}`;
        item.componentPath = "dynamic/detail";
        item.meta = simpleMeta;
      } else {
        let tempPathArr = url.split("/");
        tempPathArr.shift();
        if (url === "/dynamic/index") {
          item.path = `/dynamic-${id}/index`;
          item.name = `dynamic-${id}-index`;
        } else {
          item.path = url;
          // 过滤掉params参数
          item.name = tempPathArr.filter((item) => !item.startsWith(":")).join("-");
        }
        // 去掉params参数
        item.componentPath = tempPathArr.filter((item) => !item.startsWith(":")).join("/");
        item.meta = {
          ...simpleMeta,
          btnPermissionList,
          type,
          cache: true,
        };
      }
    }
    // 字段简化
    delete item.perms;
    delete item.sortBy;
    delete item.frontPerms;
    delete item.remarks;
    delete item.url;
    delete item.type;
    if (!icon) delete item.icon;
    return item;
  });
  const routerTree = vm.$createTree({
    list: formatedRouterData,
    code: "id",
    parentCode: "parentId",
    children: "children",
  });
  // 获取格式化后的树形树据
  const formatedTreeData = routerTreeFormat(routerTree);
  // 拼接成树
  const routerTreeData = vm.$createTree({
    list: formatedTreeData,
    code: "id",
    parentCode: "parentId",
    children: "children",
  });
  // 设置redirect
  setRedirect(routerTreeData);
  // 设置动态路由详情
  setDynamicDetailRouter(routerTreeData);
  return routerTreeData;
};

/**
 * 获取按钮权限配置
 */
const getBtnPermsObj = (routerData) => {
  const btnPermObj = {};
  routerData.map((item) => {
    const { type, parentId, frontPerms } = item;
    // type:2 => 按钮
    if (!frontPerms || frontPerms === "/" || type !== "2") return;
    (btnPermObj[parentId] || (btnPermObj[parentId] = [])).push(frontPerms);
  });
  return btnPermObj;
};

/**
 * 添加事项详情路由
 */
const setDynamicDetailRouter = (routerTreeData) => {
  routerTreeData.map((item) => {
    const { children = [], name: parentName } = item;
    for (let i = 0; i < children.length; i++) {
      const { name } = children[i];
      if (name.includes("-dynamic-table-")) {
        children.push({
          name: `${parentName}-dynamic-detail`,
          path: `/${parentName}/dynamic/detail`,
          componentPath: "dynamic/detail",
          meta: { auth: true, title: "事项详情" },
        });
        break;
      }
    }
  });
};

/**
 * 路由树数据格式化
 */
const routerTreeFormat = (routerTree) => {
  let tempRouterArr = [];
  const routerFormat = ({ list: router, parentId, parentPath }) => {
    router.map((item) => {
      const { children, ...obj } = item;
      obj.parentId = parentId;
      const { path, name } = obj;
      const tempArr = path.split("/");
      if (tempArr[1] !== parentPath) {
        obj.path = `/${parentPath}${path}`;
        obj.name = `${parentPath}-${name}`;
      } else {
        // obj.path = `/${parentPath}/${tempArr[tempArr.length - 1]}`
        obj.path = tempArr.join("/");
      }
      // 只选择了菜单，不做路由拼接的操作
      if (children && children.length) {
        routerFormat({ list: children, parentId, parentPath });
      } else {
        tempRouterArr.push(obj);
      }
    });
  };
  routerTree.map((item) => {
    const { children, ...obj } = item;
    tempRouterArr.push(obj);
    if (children && children.length) {
      const { id, path } = obj;
      routerFormat({
        list: children,
        parentId: id,
        parentPath: path.replace("/", ""),
      });
    }
  });
  return tempRouterArr;
};

/**
 * 设置redirect
 */
const setRedirect = (routerTreeData) => {
  routerTreeData.map((item) => {
    const { children } = item;
    if (children && children.length) {
      const { name } = children[0];
      Object.assign(item.redirect, {
        name,
      });
      // 动态配置的菜单，需要带上itemCode参数
      let tempArr = name.split("dynamic-table-");
      if (tempArr.length > 1) {
        item.redirect.query = {
          itemCode: tempArr[1],
        };
      }
    }
  });
};
