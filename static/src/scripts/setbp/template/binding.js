import {fatal, getPropDef} from 'setbp/kernel/basics.js';
import {func} from 'core/acts-funcs.js';

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
      m: strip,
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
      statement.m = 1; // literal by default
      if (statementVal[0] == '~') {
        statement.v = statementVal.slice(1);
        if (statement.v[0] != '~') {
          statement.m = 0; // not a literal
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

function getVal(binding, data) {
  var val = binding.v;
  if (!binding.m) {
    if (val == '_') {
      val = data;
    } else if (val == '#') {
      val = '';
    } else {
      val = getPropDef(val, data);
    }
  }
  return val;
}

function runFuncs(funcs, opts, data, val, applyText) {
  if (funcs) {
    funcs.forEach(function(funcBinding) {
      var args = [val, opts];
      funcBinding.p && funcBinding.p.forEach(param => {
        args.push(param.m ? param.v : getVal(param, data));
      });
      val = funcBinding.f.apply(opts, args);
    });
  } else if (applyText) {
    opts.$el.text(val);
  }
  return val;
}

function getGroupVal(binding, opts, data, applyText) {
  return runFuncs(binding.f, opts, data, getVal(binding, data), applyText);
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
      remove = !getGroupVal(binding, opts, data);
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

export function applyBindings($el, comp, data) {
  let bindings = createBindings($el.data('bind'), (comp.rComp || comp).data);
  let opts = {$el, comp, data};
  bindings.forEach(function(binding) {
    let groupVal = getGroupVal(binding, opts, data, !binding.g);
    binding.g && binding.g.forEach(function(group) {
      runFuncs(group, opts, data, groupVal, 1);
    });
  });
}
