import {getProp} from 'setbp/utility/objects.js';

var defData = {};

export function fatal(m, a, b, c) {
  throw {m, a, b, c};
}

export function getPropDef(propPath, data) {
  return getProp(propPath, data, defData);
}

export function setDefData(name, val) {
  defData['@' + name] = val;
}
