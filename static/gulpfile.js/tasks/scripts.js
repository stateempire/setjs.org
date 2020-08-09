var gulp = require('gulp');
var webpack = require('webpack');
var wpStream = require('webpack-stream');
var gulpif = require('gulp-if');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var {paths, env, settings} = require('../setup.js');

var alias;

if (settings.local_setjs) {
  alias = {
    Router: `setjs/router/${settings.routerName}-router.js`,
    '@stateempire/setjs': `setjs/index.js`
  };
} else {
  alias = {
    Router: `@stateempire/setjs/src/router/${settings.routerName}-router.js`
  };
}

var wpConfig = {
  output: {
    filename: 'bundle.js',
    library: 'setjsApp',
    libraryTarget: 'window',
  },
  plugins: [
    // https://github.com/moment/moment/issues/2517#issuecomment-393704231
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  devtool: env.current.devtool || '', // https://webpack.js.org/configuration/devtool/
  mode: env.current.mode,// https://webpack.js.org/concepts/mode/
  resolve: {
    alias: alias,
    modules: [paths.src.scripts, 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  }
};

function lint() {
  return gulp.src(paths.src.scripts + '/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(gulpif(env.current.mode != env.local.mode, eslint.failAfterError()));
}

function compile() {
  return gulp.src(paths.src.scripts + '/main.js')
    .pipe(plumber())
    .pipe(wpStream(wpConfig, webpack))
    .pipe(gulp.dest(paths.dest.scripts));
}

exports.scripts = gulp.series(lint, compile);
