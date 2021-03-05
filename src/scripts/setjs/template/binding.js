import {fatal, getPropDef, dataForName} from 'setjs/kernel/basics.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {func} from 'core/acts-funcs.js';

var watchSet = new Set();
var watchMap = new WeakMap();

eventManager.addListener(eventTypes.loaded, 'binding', updateWatches);

function getStatements(bindingStr) {
  var statements = [];
  var opType = ';';
  var start = 0;
  var strip = 0;
  var i, char, escape;

  for (i = 0; i < bindingStr.length; i++) {
    char = bindingStr[i];
    if (char == '`' && bindingStr[i - 1] != '\\') {
      escape = !escape;
      if (escape && start < i) {
        parseError(char);
      }
      strip = 1;
    } else if (!escape && (char == ';' || char == ',' || char == '|' || char == ':')) {
      pushOp();
      opType = char;
    }
  }
  if (start < i + 1) {
    pushOp();
  }
  return statements;

  function pushOp() {
    if (escape) {
      parseError('`');
    }
    var item = {
      o: opType,
      v: bindingStr.slice(start + strip, i - strip),
      s: strip,
    };
    if (opType != ',' && !item.v) {
      parseError('val needed');
    }
    statements.push(item);
    start = i + 1; // +1, as "i" has not yet incremented in the for loop
    strip = 0;
  }

  function parseError(msg) {
    fatal('bind:' + msg, start, bindingStr);
  }
}

function createBindings(bindingStr, rdata, isIf) {
  var bindings = [];
  var statements = getStatements(bindingStr);
  var binding, funcBinding;
  statements.forEach(function(statement) {
    if (statement.o == ';' || (statement.o == ':' && isIf)) {
      bindings.push(statement);
      binding = statement;
    } else if (statement.o == '|' && !binding.g) {
      binding.f = binding.f || [];
      pushFunc(binding.f, statement);
    } else if (statement.o == ',') {
      let statementVal = statement.v;
      funcBinding.p = funcBinding.p || [];
      statement.s = 1; // literal by default
      if (statementVal[0] == '~') {
        statement.v = statementVal.slice(1);
        if (statement.v[0] != '~') {
          statement.s = 0; // not a literal
        }
      }
      funcBinding.p.push(statement);
    } else { // either "|" or ":"
      let groups = binding.g = binding.g || [];
      statement.o == ':' && groups.push([]);
      pushFunc(groups[groups.length - 1], statement);
    }
  });
  return bindings;

  function pushFunc(list, statement) {
    var funcName = statement.v;
    funcBinding = {f: rdata[funcName] || func(funcName)};
    list.push(funcBinding);
  }
}

function getBindingVal(binding, opts) {
  var val = binding.v;
  if (!binding.s) {
    if (val == '_') {
      val = opts.data;
    } else if (val == '#') {
      val = '';
    } else {
      val = getPropDef(val, opts.data);
      if (typeof val == 'function') {
        val = val(opts);
      }
    }
  }
  return val;
}

function runFuncs(funcs, opts, val, applyText) {
  if (funcs) {
    funcs.forEach(function(funcBinding) {
      var args = [val, opts];
      funcBinding.p && funcBinding.p.forEach(param => {
        args.push(param.s ? param.v : getBindingVal(param, opts));
      });
      val = funcBinding.f.apply(opts, args);
    });
  } else if (applyText) {
    opts.$el.text(val);
  }
  return val;
}

function getGroupVal(binding, opts, applyText) {
  return runFuncs(binding.f, opts, getBindingVal(binding, opts), applyText);
}

export function processIf($el, comp, data, dataIf) {
  let remove = 1;
  let bindings = createBindings(dataIf, (comp.rComp || comp).data, 1);
  let opts = {$el, comp, data};
  let groups = [];
  $.each(bindings, function(i, binding) {
    if (binding.o == ';') {
      groups.push([binding]);
    } else {
      groups[groups.length - 1].push(binding);
    }
  });
  $.each(groups, function(i, group) {
    $.each(group, function(i, binding) {
      remove = !getGroupVal(binding, opts);
      return remove;
    });
    return !remove;
  });
  if (remove) {
    let $next = $el.next('[data-elif]');
    $el.remove();
    if ($next.length) {
      processIf($next, comp, data, $next.data('elif'));
    }
  } else {
    $el.nextUntil(':not([data-elif])').remove();
    $el.next('[data-else]').remove();
  }
}

function runBinding(binding, opts) {
  let groupVal = getGroupVal(binding, opts, !binding.g);
  binding.g && binding.g.forEach(function(group) {
    runFuncs(group, opts, groupVal, 1);
  });
}

export function applyBindings($el, comp, data) {
  let bindings = createBindings($el.data('bind'), (comp.rComp || comp).data);
  let opts = {$el, comp, data};
  bindings.forEach(function(binding) {
    runBinding(binding, opts);
  });
}

function ensureWatch(obj) {
  let watch = watchMap.get(obj);
  if (!watch) {
    watch = {obj, props: new Set(), acts: new Set()};
    watchMap.set(obj, watch);
    watchSet.add(obj);
  }
  return watch;
}

function objChange(parentWatch, oldVal, newVal) {
  let watch = watchMap.get(oldVal);
  if (watch) {
    let newWatch = ensureWatch(newVal);
    let found = new Set();
    watch.props.forEach(key => {
      setupWatch(newWatch, newVal, key);
      objChange(watch, watch.obj[key], newWatch.obj[key]);
    });
    for (let pAct of parentWatch.acts) {
      for (let wAct of watch.acts) {
        if (wAct == pAct) {
          found.add(wAct);
        }
      }
    }
    for (let act of found) {
      newWatch.acts.add(act);
      watch.acts.delete(act);
      if (act.watch) {
        act.watch = newWatch;
        runBinding(act.binding, act.opts);
      }
    }
    cleanupWatch(oldVal);
  }
}

function setupWatch(watch, obj, key) {
  if (!watch.props.has(key)) {
    watch.props.add(key);
    let val = obj[key];
    Object.defineProperty(obj, key, {
      get () {
        return val;
      },
      set (newVal) {
        if (val !== newVal) {
          let oldVal = val;
          val = newVal;
          objChange(watch, oldVal, newVal);
          watch.acts.forEach(act => {
            if (act.watch == watch) {
              runBinding(act.binding, act.opts);
            }
          });
        }
      }
    });
  }
}

function processWatch(parts, data, act) {
  let key = parts.shift();
  let obj = dataForName(key, data);
  if (obj) {
    let watch = ensureWatch(obj);
    let val = obj[key];
    watch.acts.add(act);
    setupWatch(watch, obj, key);
    if (parts.length) {
      processWatch(parts, val, act);
    } else {
      act.watch = watch;
      runBinding(act.binding, act.opts);
    }
  }
}

export function cleanupWatch(obj) {
  var watch = watchMap.get(obj);
  if (watch) {
    let remove = [];
    watch.props.forEach(key => {
      cleanupWatch(obj[key]);
    });
    watch.acts.forEach(act => {
      if (!act.opts.$el.data('watched')) {
        remove.push(act);
      }
    });
    remove.forEach(act => {
      watch.acts.delete(act);
    });
    if (!watch.acts.size) {
      watchMap.delete(obj);
      watchSet.delete(obj);
    }
  }
}

export function updateWatches() {
  watchSet.forEach(obj => {
    cleanupWatch(obj);
  });
}

export function applyWatch($el, comp, data) {
  let opts = {$el: $el.data('watched', 1), comp, data};
  let bindings = createBindings($el.data('watch'), (comp.rComp || comp).data);
  bindings.forEach(binding => {
    processWatch(binding.v.split('.'), data, {binding, opts});
  });
}
