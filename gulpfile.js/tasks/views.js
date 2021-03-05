var gulp = require('gulp');
var fileinclude = require('gulp-file-include');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var {paths, settings} = require('../setup.js');

function htmlViews() {
  return gulp.src(paths.src.views + '/page/**/*.html')
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: 'src'
    }))
    .pipe(replace(/@replace{([^{}]*)}/g, function(match, group1) {
      if (group1 in settings) {
        return settings[group1];
      }
      return match;
    }))
    .pipe(gulp.dest(paths.dest.base));
}

exports.views = htmlViews;
