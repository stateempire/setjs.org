var gulp = require('gulp');
var gulpif = require('gulp-if');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var purgecss = require('gulp-purgecss');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var {paths, env} = require('../setup.js');

function buildCss(path) {
  return function () {
    return gulp.src(`${paths.src.styles}/${path}.css`)
      .pipe(plumber())
      .pipe(postcss([
        require('postcss-import'),
        require('postcss-for'),
        require('postcss-simple-vars'),
        require('postcss-hexrgba'),
        require('tailwindcss'),
        require('postcss-nested'),
        require('autoprefixer'),
      ]))
      .pipe(gulpif(env.current.mode != env.local.mode, purgecss({
        content: [paths.dest.base + '/index.html', paths.dest.base + '/templates/**/*.html'],
        whitelistPatterns: [],
        whitelist: ['hide', 'disabled', 'blockquote']})))
      .pipe(gulpif(env.current.mode != env.local.mode, cleanCSS()))
      .pipe(gulp.dest(paths.dest.styles))
      .pipe(gulpif(env.current.mode == env.local.mode, browserSync.get('setjs-serve').stream()));
  };
}

exports.styles = gulp.parallel(
  // buildCss('common'),
  buildCss('main'),
);
