/**
 * 滚动到显示区
 * @param  {Number} [paddingTop=0}] [由于我写的组件中设置了一波padding-top,所以要做一下容错]
 */
export default function scrollIntoView({ container, selected, paddingTop = 0 }) {
  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents = [];
  let pointer = selected.offsetParent;
  while (pointer && container !== pointer && container.contains(pointer)) {
    offsetParents.push(pointer);
    pointer = pointer.offsetParent;
  }
  const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);

  // const bottom = top + selected.offsetHeight
  // const viewRectTop = container.scrollTop
  // const viewRectBottom = viewRectTop + container.clientHeight

  // if (top < viewRectTop) {
  container.scrollTop = top - paddingTop;
  // } else if (bottom > viewRectBottom) {
  //   container.scrollTop = bottom - container.clientHeight + paddingTop
  // }
}
