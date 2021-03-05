var del = require('del');
var {paths} = require('../setup.js');

function clean(cb) {
  del.sync(paths.dest.base + '/**');
  cb();
}

exports.clean = clean;
