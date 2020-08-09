var gulp = require('gulp');
var changed = require('gulp-changed');
var size = require('gulp-size');
var {paths} = require('../setup.js');

function siteRoot() {
  return gulp.src(paths.blob.root)
    .pipe(changed(paths.dest.base))
    .pipe(gulp.dest(paths.dest.base));
}

function data() {
  return gulp.src(paths.blob.data)
    .pipe(changed(paths.dest.data))
    .pipe(gulp.dest(paths.dest.data))
    .pipe(size({title: 'data'}));
}

function fonts() {
  return gulp.src(paths.blob.fonts)
    .pipe(changed(paths.dest.fonts))
    .pipe(gulp.dest(paths.dest.fonts))
    .pipe(size({title: 'fonts'}));
}

function videos() {
  return gulp.src(paths.blob.videos)
    .pipe(changed(paths.dest.videos))
    .pipe(gulp.dest(paths.dest.videos))
    .pipe(size({title: 'video'}));
}

function vendor() {
  return gulp.src(paths.blob.vendor)
    .pipe(changed(paths.dest.vendor))
    .pipe(gulp.dest(paths.dest.vendor))
    .pipe(size({title: 'vendor'}));
}

exports.copy = gulp.parallel(siteRoot, data, fonts, videos, vendor);
exports.copyTasks = {
  [paths.blob.root]: siteRoot,
  [paths.blob.data]: data,
  [paths.blob.fonts]: fonts,
  [paths.blob.videos]: videos,
  [paths.blob.vendor]: vendor
};
