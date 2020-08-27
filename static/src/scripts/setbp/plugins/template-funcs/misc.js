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
});
