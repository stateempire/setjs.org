import anime from 'animejs';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

var animations = [];
var marquees = [];
var pageId = 1;

function checkView() {
  var height = $(window).height();
  var top = $(document).scrollTop();
  var bottom = top + height;
  for (var i = marquees.length - 1; i >= 0; i--) {
    let marquee = marquees[i];
    if (isInView(marquee.$el, 500)) {
      marquees.splice(i, 1);
      marquee.start();
    }
  }

  animations.forEach(function(item) {
    if (isInView(item.$marquee)) {
      item.animation.play();
    } else {
      item.animation.pause();
    }
  });

  function isInView($el, diff = 0) {
    var elTop = $el.offset().top - diff;
    var elBottom = elTop + $el.height() + diff;
    return elBottom > top && elTop < bottom;
  }
}

eventManager.addListener(eventTypes.view, 'marquee', checkView);
eventManager.addListener(eventTypes.route, 'marquee', function() {
  pageId++;
  animations.forEach(function(item) {
    anime.remove(item.$marquee[0]);
    item.animation.pause();
  });
  animations = [];
  marquees = [];
});

$.fn.marquee = function() {
  var marqueePage = pageId;
  var $el = this;
  var $marquee = $el.find('.marquee').addClass('marquee-loading');
  var repeat = $el.data('repeat') || 0;
  var count = $marquee.find('>*').length;
  if (repeat) {
    let $item = $marquee.find('>*');
    count *= repeat;
    while (repeat-- > 0) {
      $marquee.append($item.clone());
    }
  }
  marquees.push({$el, start});
  return $el;

  function start() {
    if (marqueePage == pageId) {
      let notLoaded = $el.find('[data-lm]:not(.loaded)').length;
      if (notLoaded) {
        setTimeout(start, 800);
      } else {
        $marquee.removeClass('marquee-loading');
        appendExtra();
        animate();
      }
    }
  }

  function animate() {
    var time = $el.data('time') || count * 5;
    var left = -$marquee.find('>*:eq(' + count + ')').position().left;
    var reverse = $el.hasClass('reverse');
    if (reverse) {
      left = $el.width() - $marquee.find('>*:eq(' + (count - 1) + ')').position().left;
    }
    left = Math.round(left);
    var animation = anime({
      targets: $marquee[0],
      translateX: left,
      duration: time * Math.abs(left),
      loop: true,
      easing: 'linear',
    });
    animations.push({animation, $marquee});
  }

  function appendExtra() {
    var $list = $marquee.find('>*');
    var index = 0;
    var width = 0;

    while (width < $el.width() && index < count) {
      let $item = $list.eq(index);
      let $el = $item.data('clone') ? $item.data('clone')() : $item.clone();
      $marquee.append($el);
      width += $item.outerWidth();
      index++;
    }
  }
};
