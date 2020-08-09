var gulp = require('gulp');

var {env, settings} = require('./setup.js');

var {clean} = require('./tasks/clean.js');
var {copy} = require('./tasks/copy.js');
var {styles} = require('./tasks/styles.js');
var {images} = require('./tasks/images.js');
var {scripts} = require('./tasks/scripts.js');
var {views} = require('./tasks/views.js');
var {serve} = require('./tasks/serve.js');

var dist = gulp.series(
  clean,
  gulp.parallel(copy, images, views, scripts),
  styles
);

exports.test = function(cb) {
  console.log({settings, env});
  cb();
};
exports.copy = copy;
exports.images = images;
exports.views = views;
exports.scripts = scripts;
exports.dist = dist;
exports.styles = gulp.series(views, styles);
exports.default = gulp.series(dist, serve);
