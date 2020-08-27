import {addFuncs} from 'core/acts-funcs.js';

addFuncs({
  dump: function(val, opts) {
    opts.$el.html(JSON.stringify(val, null, 2));
  },
  log: function(val) {
    console.log(val);
  },
});
