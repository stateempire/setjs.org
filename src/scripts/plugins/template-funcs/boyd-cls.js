import {addFuncs} from 'core/acts-funcs.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

var $body = $('body');
var clickCls;

addFuncs({
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
