import setjs from '@stateempire/setjs';

setjs.addFuncs({
  stopEnter: function(val, opts) {
    opts.$el.off('keypress').on('keypress', function(e) {
      if (e.which == 13) {
        e.preventDefault();
      }
    });
  }
});
