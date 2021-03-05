import {getProp} from 'setjs/utility/objects.js';

var defData = {};

export function fatal(msg, info, ...extra) {
  throw {msg, info, extra};
}

export function getPropDef(propPath, data) {
  return getProp(propPath, data, defData);
}

export function setDefData(name, val) {
  defData['@' + name] = val;
}

export function dataForName(name, data) {
  return name in data ? data : name in defData ? defData : null;
}
