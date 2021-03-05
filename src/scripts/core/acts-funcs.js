var functions = {};
var actions = {};
var jqList = ['attr', 'css', 'data', 'html', 'prop', 'text', 'addClass', 'toggleClass', 'val'];

export function act(funcName) {
  if (actions[funcName]) {
    return actions[funcName];
  }
  throw {msg: 'No such function', name: funcName};
}

export function func(funcName) {
  if (functions[funcName]) {
    return functions[funcName];
  } else if (jqList.indexOf(funcName) >= 0) {
    functions[funcName] = function(val, {$el}, val2) {
      if (arguments.length > 2) {
        $el[funcName](val2, val);
      } else {
        $el[funcName](val);
      }
    };
    return functions[funcName];
  } else {
    throw {msg: 'No such function', name: funcName};
  }
}

export function jqFuncs(list) {
  jqList = jqList.concat(list);
}

export function addAction(name, onFunc) {
  if (actions[name]) {
    throw 'action exists: ' + name;
  }
  actions[name] = onFunc;
}

export function addFuncs(funcs) {
  Object.keys(funcs).forEach(function(funcName) {
    if (functions[funcName] || typeof funcs[funcName] != 'function') {
      throw {msg: 'Duplicate or not a function', funcName, funcs};
    }
    functions[funcName] = funcs[funcName];
  });
}
