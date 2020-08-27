function processType(path, val) {
  var type = path.slice(-1);
  if (path[path.length - 2] == ':') {
    path = path.slice(0, -2);
    if (type == 'n') {
      val = +val;
    } else if (type == 'b') {
      val = !!val;
    }
  }
  return {path, val};
}

function listIndex(str) {
  if (str.length) {
    if (isNaN(str)) {
      return str;
    } else {
      return +str;
    }
  }
}

function parsePath(path) {
  var parts = [];
  var mark = 0;
  var skip;
  for (var i = 0; i < path.length; i++) {
    if (skip) {
      if (path[i] == ']') {
        parts.push({list: 1, key: path.slice(mark, skip), index: listIndex(path.slice(skip + 1, i))});
        mark = i + 1;
        skip = 0;
      }
    } else if (path[i] == '[') {
      skip = i;
      if (!i) {
        throw 'Bad object config ' + path;
      }
    } else if (path[i] == '.') {
      addObj();
      mark = i + 1;
    }
  }
  addObj();
  return parts;

  function addObj() {
    if (mark < i) {
      parts.push({key: path.slice(mark, i)});
    }
  }
}

function partIndex(part, arr) {
  return part.list ? part.index != null ? part.index : arr.length : null;
}

export function storeValue(target, _path, _val) {
  var {path, val} = processType(_path, _val);
  var parts = parsePath(path);
  var index;
  parts.forEach(function(part, i) {
    let end = i == parts.length - 1;
    if (Array.isArray(target)) {
      storeInArray(part, end);
    } else {
      storeInObject(part, end);
    }
    index = partIndex(part, target);
  });

  function storeInObject(part, end) {
    let tmp = target[part.key];
    if (part.list) {
      tmp = Array.isArray(tmp) ? tmp : [];
      if (end) {
        tmp[partIndex(part, tmp)] = val;
      }
    } else {
      if (end) {
        tmp = val;
      } else {
        tmp = typeof tmp == 'object' ? tmp : {};
      }
    }
    target = target[part.key] = tmp;
  }

  function storeInArray(part, end) {
    let tmp = target[index];
    if (part.list) {
      if (part.key) {
        if (typeof tmp != 'object') {
          tmp = target[index] = {};
        }
        tmp = tmp[part.key] = Array.isArray(tmp[part.key]) ? tmp[part.key] : [];
      } else {
        tmp = target[index] = Array.isArray(tmp) ? tmp : [];
      }
      if (end) {
        tmp[partIndex(part, tmp)] = val;
      }
    } else {
      target[index] = tmp = typeof tmp == 'object' ? tmp : {};
      if (end) {
        tmp[part.key] = val;
      } else {
        tmp = tmp[part.key] = {};
      }
    }
    target = tmp;
  }
}
