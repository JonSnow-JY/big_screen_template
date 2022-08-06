/**
 * 通过文件链接获取文件名
 */
export default (filePath) => {
  if (!filePath) return "";
  const tempArr = filePath.split("/");
  const { length } = tempArr;
  if (!length) return "";
  return tempArr[length - 1];
};
