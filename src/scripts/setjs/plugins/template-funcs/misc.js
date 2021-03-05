import {addFuncs} from 'core/acts-funcs.js';

addFuncs({
  t: function (val, opts) {
    opts.$el.text(val);
  },
  h: function (val, opts) {
    opts.$el.html(val);
  },
  gt: function(val, opts, other) {
    return val > other;
  },
  lt: function(val, opts, other) {
    return val < other;
  },
  plurify: function(number, {$el}, singular, plural) {
    plural = plural || singular + 's';
    number = number || 0;
    $el.text(number + ' ' + (number == 1 ? singular : plural));
  },
  test: function(str, opts, pattern) {
    return RegExp(pattern).test(str);
  },
});
