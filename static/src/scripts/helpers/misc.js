import setup from 'config/setup.js';

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
