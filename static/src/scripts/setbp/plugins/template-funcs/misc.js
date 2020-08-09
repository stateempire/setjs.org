import setjs from '@stateempire/setjs';

setjs.addFuncs({
  t: function (val, opts) {
    opts.$el.text(val);
  },
  h: function (val, opts) {
    opts.$el.html(val);
  },
  dump: function(val, opts) {
    opts.$el.html(JSON.stringify(val, null, 2));
  },
});
