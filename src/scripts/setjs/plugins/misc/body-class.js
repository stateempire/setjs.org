import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

var $body = $('body');
var bodyClass;

eventManager.addListener(eventTypes.view, 'body', function(t, b, height) {
  var cls = '';
  $(':not(.hide)[data-bodyclass]').each(function() {
    var elTop = $(this)[0].getBoundingClientRect().top;
    if (elTop < height * 0.5) {
      cls = $(this).data('bodyclass');
    }
  });
  $body.removeClass(bodyClass).addClass(cls);
  bodyClass = cls;
});
