var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var plumber = require('gulp-plumber');
var {paths} = require('../setup.js');

function images() {
  return gulp.src(paths.blob.images, {since: gulp.lastRun(images)})
    .pipe(plumber())
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false},
        ],
      }),
    ]))
    .pipe(gulp.dest(paths.dest.images))
    .pipe(size({title: 'images'}));
}

exports.images = images;
