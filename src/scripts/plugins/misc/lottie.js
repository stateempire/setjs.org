import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.loaded, 'binding', function() {
  $('.inline-logo figure').each(function() {
    var container = this;
    $.getJSON('/data/app/logo.json')
    .done(function(animationData) {
      lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: animationData,
      });
    });
  });
});
