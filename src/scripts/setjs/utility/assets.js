var loaded = {};

export function getFileMimeType(file, callback) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var filereader = new FileReader();
    filereader.onload = function(evt) {
      var hex = Array.prototype.slice.call(new Uint8Array(evt.target.result)).map(x => x.toString(16)).join('').toUpperCase();
      var reg = /^(FFD8FF(?:DB|E[01238]))|^(89504E47)|^(47494638)/;
      var result = hex.replace(reg, function(m, jpg, png, gif) {
        return jpg ? 'jpeg' : (png ? 'png' : (gif ? 'gif' : ''));
      });
      var type = (reg.test(hex) && `image/${result}`) || file.type || '';
      var ext = type.split('/')[1];
      callback(type, ext == 'jpeg' ? 'jpg' : ext);
    };
    filereader.onerror = function() {
      callback(file.type, file.type && file.type.split('/')[1]);
    };
    filereader.readAsArrayBuffer(file.slice(0, 4));
  }
}

export function fileAsDataURL(file, onload) {
  var reader = new FileReader();
  reader.addEventListener('load', function () {
    onload(reader.result);
  }, false);
  reader.readAsDataURL(file);
}

function processUrlLoad(url, el, success, error) {
  if (loaded[url]) {
    processLoaded();
  } else {
    el.id = ('id_' + Date.now() + Math.random()).replace('.', '');
    el.onload = function() {
      loaded[url] = {status: 2, id: el.id};
      processLoaded();
    };
    el.onerror = function() {
      loaded[url] = {status: 0};
      $('head').find('#' + el.id).remove();
      processLoaded();
    };
    loaded[url] = {status: 1};
    document.getElementsByTagName('head')[0].appendChild(el);
  }

  function processLoaded() {
    var {status} = loaded[url];
    if (status == 1) { // pending
      setTimeout(processLoaded, 500);
    } else if (status == 2) {
      success && success();
    } else {
      error && error();
    }
  }
}

export function unloadHead(url) {
  if (loaded[url]) {
    $('head #' + loaded[url].id).remove();
    loaded[url] = 0;
  }
}

export function loadJS(url, success, error) {
  var el = document.createElement('script');
  el.src = url;
  processUrlLoad(url, el, success, error);
}

export function loadCSS(url, success, error) {
  var el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = url;
  processUrlLoad(url, el, success, error);
}


export function loadUrls(urls, kind, success, errorCb) {
  var done = 0;
  if (testArray(urls, success)) {
    urls.forEach(function(url) {
      (kind == 'css' ? loadCSS : loadJS)(url, function() {
        done++;
        if (done == urls.length) {
          success();
        }
      }, errorCb);
    });
  }
}

function testArray(obj, otherwise) {
  if (Array.isArray(obj) && obj.length) {
    return true;
  } else {
    otherwise();
  }
}

function loadJSCSS(urls, success, errorCb) {
  var done = 0;
  if (testArray(urls, success)) {
    urls.forEach(function(url) {
      (/\.css(?:\?.*)*$/.test(url) ? loadCSS : loadJS)(url, function() {
        done++;
        if (done == urls.length) {
          success();
        }
      }, errorCb);
    });
  }
}

export function loadAssets({urlSets, success, error, errMsg}) {
  var done = 0;
  if (testArray(urlSets, success)) {
    urlSets.forEach(function(urls) {
      loadJSCSS(urls, function() {
        done++;
        if (done == urlSets.length) {
          success();
        }
      }, function() {
        if (error) {
          error(errMsg);
          error = 0;
        }
      });
    });
  }
}


export function loadImage({url, success, error, complete}) {
  var img = new Image();
  img.onload = function() {
    success && success(img);
    complete && complete(1, img);
  };
  img.onerror = function(...args) {
    error && error(args);
    complete && complete(0, args);
  };
  img.src = url;
  return {
    cancel: function() {
      success = null;
      error = null;
      complete = null;
    }
  };
}

// list is either an array of URL strings or a jQuery collection
export function loadImages(list, done) {
  var count = 0;
  var urls = list;
  var result = {};
  if (!(list && list.length)) {
    return done();
  }
  if (list.jquery) {
    urls = [];
    list.each(function() {
      urls.push($(this).attr('src'));
    });
  }
  urls.forEach(function(item) {
    var url = item.url || item;
    loadImage({
      url,
      complete: function(code, data) {
        count++;
        result[item.id || url] = code ? {item, img: data} : {item, errors: data};
        if (count == urls.length) {
          done(result);
        }
      }
    });
  });
}

export function imageAJAX(opts) {
  $.ajax({
    type: 'GET',
    url: opts.url,
    error: opts.error,
    success: opts.success,
    complete: opts.complete,
    beforeSend: function(jqXHR) {
      if (opts.prog) {
        jqXHR.onprogress = function(e) {
          if (e.lengthComputable){
            opts.prog((e.loaded / e.total * 100) || 0);
          }
        };
      }
    }
  });
}
