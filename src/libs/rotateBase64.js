/**
 * 旋转base64图片
 */
export default (data) => {
  return new Promise((resolve) => {
    const imgView = new Image();
    imgView.src = data;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const cutCoor = { sx: 0, sy: 0, ex: 0, ey: 0 }; // 裁剪坐标
    imgView.onload = () => {
      const imgW = imgView.width;
      const imgH = imgView.height;
      const size = imgH;
      canvas.width = size * 2;
      canvas.height = size * 2;
      cutCoor.sx = size;
      cutCoor.sy = size - imgW;
      cutCoor.ex = size + imgH;
      cutCoor.ey = size + imgW;
      context.translate(size, size);
      context.rotate((Math.PI / 2) * 3);
      context.drawImage(imgView, 0, 0);
      const imgData = context.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
      canvas.width = imgH;
      canvas.height = imgW;
      context.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
};
