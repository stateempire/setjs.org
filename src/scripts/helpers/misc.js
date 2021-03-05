import setup from 'config/setup.js';

let $win = $(window);

export function cloudBase() {
  return `//res.cloudinary.com/${setup.cloudinaryCloud()}/`;
}

export function imgCloud() {
  return `//res.cloudinary.com/${setup.cloudinaryCloud()}/image/upload/`;
}

export function vidCloud() {
  return `//res.cloudinary.com/${setup.cloudinaryCloud()}/video/upload/`;
}

export function imgUrl(path, size) {
  return `${imgCloud()}${size > 0 ? 'w_' + size : ''}/${path}`;
}

export function responsiveWidth($el) {
  let $parent = $el.closest('.js-scroll');
  let parentWidth = $parent.length ? $parent.width() : $win.width();
  if (parentWidth < 768) {
    return 500;
  } else if (parentWidth < 992) {
    return 900;
  }
  return 1400;
}
