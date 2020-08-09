import setjs from '@stateempire/setjs';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

var $body = $('body');
var clickCls;

setjs.addFuncs({
  bodyCls: function(val, {$el}, cls) {
    $el.off().on('click', function() {
      if (clickCls != cls) {
        $body.removeClass(clickCls);
        clickCls = cls;
      }
      $body.toggleClass(cls);
    });
  },
});

eventManager.addListener(eventTypes.unload, 'body', function() {
  $('body').removeClass(clickCls);
});
