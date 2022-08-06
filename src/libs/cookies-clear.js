// 清空所有cookies，很暴力
import cookie from "component-cookie";

export default () => {
  const cookies = cookie();
  for (var name in cookies) {
    cookie(name, null, { path: "/" });
  }
};
