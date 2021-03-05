import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import anime from 'animejs';

var $win = $(window).on('resize', parallax);
var $doc = $(document);

eventManager.addListener(eventTypes.loaded, 'parallax', parallax);
eventManager.addListener(eventTypes.resize, 'parallax', parallax);

function parallax() {
  var timeline = anime.timeline({
    duration: $doc.height() - $win.height(),
    autoplay: false,
    easing: 'linear',
  });

  $doc.find('[data-parallax]').each(function(i, el) {
    var $el = $(el);
    var speed = $el.data('parallax').speed;
    timeline.add({
      targets: el,
      translateY: `${Math.floor($win.height() * (speed || 0.4))}px`,
      duration: 2 * $win.height(),
    }, Math.max(0, $el.offset().top - $win.height()));
  });

  $win.off('.parallax').on('scroll.parallax', function() {
    var top = $doc.scrollTop();
    timeline.seek(top);
  });
}

