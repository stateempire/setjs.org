import setjs from '@stateempire/setjs';
import {slugify, capitalize} from 'setbp/utility/strings.js';

function number(val) {
  return isNaN(val) ? 0 : +val;
}

setjs.addFuncs({
  slugify,
  capitalize,
  number: function(val, opts, def) {
    return number(val == undefined ? def : val);
  },
  prefix: function(val, opts, str) {
    return str + val;
  },
  suffix: function(val, opts, str) {
    return val + str;
  },
  wrap: function(val, opts, left, right) {
    return left + val + right;
  },
  str: function(val, opts, def = '') {
    return (val != undefined && val.toString && val.toString()) || def;
  },
  fixed: function(val, opts, places) {
    return number(val).toFixed(places);
  },
  equal: function(val, opts, other) {
    return other == val;
  },
  testFlag: function(val, opts, flag) {
    flag = +flag;
    return (val & flag) == flag;
  },
  bool: function(val) {
    return !!val;
  },
  percent: function(val) {
    return number(val) + '%';
  },
  round: function(val) {
    return Math.round(number(val));
  },
  floor: function(val) {
    return Math.floor(number(val));
  },
  ceil: function(val) {
    return Math.ceil(number(val));
  },
  not: function(val) {
    return !val;
  },
  negate: function(val) {
    return -number(val);
  },
  json: function(val) {
    return JSON.parse(val);
  },
  either: function(condition, opts, val1, val2) {
    return condition ? val1 : val2;
  },
  commaList: function(list) {
    return list.join(', ');
  },
  lowerCase: function(val) {
    return val.toLowerCase();
  },
  includes: function(list, opts, item) {
    return list.indexOf(item) >= 0;
  },
});
