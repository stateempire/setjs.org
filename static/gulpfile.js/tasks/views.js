var gulp = require('gulp');
var pug = require('gulp-pug');
var plumber = require('gulp-plumber');
var {paths, settings} = require('../setup.js');

function views() {
  return gulp.src(paths.src.views + '/page/**/*.pug')
    .pipe(plumber())
    .pipe(pug({
      basedir: paths.src.views,
      data: settings,
    }))
    .pipe(gulp.dest(paths.dest.base));
}

exports.views = views;
