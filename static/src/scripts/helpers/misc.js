import setup from 'config/setup.js';

export function cloudUrl() {
  return `//res.cloudinary.com/${setup.cloudinaryCloud()}/image/upload/`;
}

export function assetUrl(path, size) {
  return `${cloudUrl()}${size > 0 ? '/w_' + size : ''}/${path}`;
}
