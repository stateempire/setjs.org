import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

var $body = $('body');
var bodyClass;

eventManager.addListener(eventTypes.scroll, 'body', function(top) {
  var center = top + $(window).height() / 2;
  var cls = '';
  $(':not(.hide)[data-bodyclass]').each(function() {
    var elTop = $(this).offset().top;
    if (elTop < center) {
      cls = $(this).data('bodyclass');
    }
  });
  $body.removeClass(bodyClass).addClass(cls);
  bodyClass = cls;
});
