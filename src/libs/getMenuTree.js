/**
 * 获取菜单树形数据
 */
export default ({ menuData, vm }) => {
  // 过滤出菜单和外部链接(去掉框架内部跳转)数据,并做排序
  const usedMenuData = menuData
    .filter(
      (item) =>
        item.type === "1" ||
        (item.type === "5" && !(item.parentId === 0 && item.perms === "iframe"))
    )
    .sort((a, b) => a.sortBy - b.sortBy);

  // 简化字段
  const usefulFieldsList = usedMenuData.map((item) => {
    let { url, name, icon, id, parentId, perms, type } = item;
    return {
      title: name,
      id,
      ...(type === "5" && { perms, url }),
      parentId,
      ...(icon && { icon }),
      path: type === "5" ? `/iframe-${id}` : url,
    };
  });

  // 获取树形数据
  const menuTree = vm.$createTree({
    list: usefulFieldsList,
    code: "id",
    parentCode: "parentId",
    children: "children",
  });

  // 重置path字段
  resetPath({ list: menuTree });
  return menuTree;
};

/**
 * 重置path字段
 */
const resetPath = ({ list: arr, parentPath = "" }) => {
  arr.map((item) => {
    let { parentId, path, children, id } = item;
    if (parentId === 0) {
      // 设置一级动态菜单path
      if (path === "/dynamic") {
        item.path += `-${id}`;
      }
      parentPath = item.path.replace("/", "");
      delete item.id;
      delete item.parentId;
    } else {
      if (path === "/dynamic/index") {
        path = `/dynamic-${id}/index`;
      }
      const tempArr = path.split("/");
      if (tempArr[1] !== parentPath) {
        item.path = `/${parentPath}${path}`;
      }
      delete item.id;
      delete item.parentId;
    }
    if (children && children.length) {
      resetPath({ list: children, parentPath });
    }
  });
};
