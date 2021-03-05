import {getProp} from 'setjs/utility/objects.js';

// https://davidwalsh.name/javascript-debounce-function#comment-509154
// Returns a function, that, as long as it continues to be invoked, will only
// trigger every N milliseconds. If <code>immediate</code> is passed, trigger the
// function on the leading edge, instead of the trailing.
export function throttle(func, wait = 250, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait = 250, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export function batchCall({success, error, progress}) {
  var done = 0;
  var result = {};
  var calls = [];
  var callManager = {
    go,
    add: function(func, opts, key, prop) {
      calls.push({func, opts, key, prop});
      return callManager;
    },
  };
  return callManager;

  function go() {
    if (!calls.length) {
      success(result);
    }
    calls.forEach(function(item) {
      item.func($.extend({}, item.opts, {
        error: function(errObj) {
          typeof error == 'function' && error(errObj);
          error = 1;
        },
        success: function(res) {
          done++;
          if (item.key) {
            result[item.key] = item.prop ? getProp(item.prop, res) : res;
            item.opts && item.opts.success && item.opts.success(res);
          }
          if (error != 1 && progress) {
            progress({done, rem: calls.length - done, percent: Math.round(100 * done / calls.length)});
          }
          if (done == calls.length) {
            success(result);
          }
        }
      }));
    });
  }
}

export function serialCall({condition, success, error}) {
  var calls = [];
  var callManager = {
    go,
    add: function(func, opts) {
      calls.push({func, opts});
      return callManager;
    },
  };
  return callManager;

  function go(...args) {
    if (calls.length) {
      if ((!condition || condition())) {
        var item = calls.shift();
        var opts = $.extend({success: go, error}, item.opts);
        item.func(opts, ...args);
      }
    } else {
      success && success();
    }
  }
}
