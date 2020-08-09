var gulp = require('gulp');
var historyApiFb = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create('setjs-serve');

var {paths, settings} = require('../setup.js');
var {copyTasks} = require('./copy.js');
var {images} = require('./images.js');
var {scripts} = require('./scripts.js');
var {styles} = require('./styles.js');
var {views} = require('./views.js');

function reload(cb) {
  browserSync.reload();
  cb();
}

function serve(cb) {
  browserSync.init({
    port: settings.site_port,
    server: {
      baseDir: paths.dest,
      middleware: [historyApiFb()],
    },
  });
  gulp.watch(paths.src.views + '/**/*', gulp.series(views, styles, reload));
  gulp.watch(paths.src.scripts + '/**/*', gulp.series(scripts, reload));
  gulp.watch(paths.src.styles + '/**/*', styles);
  gulp.watch(paths.blob.images, gulp.series(images, reload));
  Object.keys(copyTasks).forEach(function(path) {
    gulp.watch(path, gulp.series(copyTasks[path], reload));
  });
  cb();
}

exports.serve = serve;
