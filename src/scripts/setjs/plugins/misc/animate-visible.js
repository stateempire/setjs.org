import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.view, 'animate-visible', function(top, bottom) {
  $('[data-animation]').not('.animated').each(function() {
    var $el = $(this);
    var elTop = $el.offset().top;
    var elBottom = elTop + $el.height();
    if (elBottom >= top && elTop <= bottom) {
      $el.addClass('animated').addClass($el.data('animation'));
    }
  });
});
