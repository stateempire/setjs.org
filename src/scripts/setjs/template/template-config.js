import {fatal, getPropDef} from 'setjs/kernel/basics.js';
import {func} from 'core/acts-funcs.js';
import {getTemplate} from 'setjs/template/templates.js';

export function getConfigTemplate(callerName, config, tId) {
  var templateStr = getTemplate(tId || config.t);
  if (typeof config != 'object') {
    fatal('Bad JSON in data-' + callerName, config);
  }
  if (!templateStr) {
    fatal('Invalid data-' + callerName, config);
  }
  $.each(config.vars, function(name, val) {
    templateStr = templateStr.replace(RegExp('{' + name + '}', 'g'), val);
  });
  $.each(config.subs, function(name, val) {
    templateStr = templateStr.replace(RegExp(name, 'g'), val);
  });
  return templateStr;
}

export function configData(config, data) {
  var funcName = config.func;
  var source = config.prop && getPropDef(config.prop, data);
  if (funcName) {
    let dataFunc = funcName && ((data.rd || data)[funcName] || func(funcName));
    typeof dataFunc != 'function' && fatal('Not a function', funcName, config, data);
    source = dataFunc(source || data, config, data);
  }
  return source;
}

export function tmpStr(templateStr, data) {
  return templateStr.replace(/{(?:(o):)?([^{}]+)}/g,
    function(match, group1, group2) {
      let result = getPropDef(group2, data);
      if (typeof result == 'boolean') {
        result = result ? 1 : 0;
      }
      return typeof result == 'string' || typeof result == 'number' ? result : group1 ? '' : match;
    }
  );
}
