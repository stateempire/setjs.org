function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex([r, g, b]) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function getDominantColor(img) {
  var c = document.createElement('canvas');
  var ctx = c.getContext('2d');
  c.width = 1;
  c.height = 1;
  ctx.drawImage(img, 0, 0, 1, 1);
  return rgbToHex(ctx.getImageData(0, 0, 1, 1).data);
}
