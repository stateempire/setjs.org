import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

var marquees = [];
var pageId = 1;

function animate() {
  marquees.forEach(function(item) {
    if (item.speed > item.runSpeed) {
      item.speed *= .99;
      if (item.speed <= item.runSpeed) {
        item.speed = item.runSpeed;
      }
    } else if (item.speed < item.runSpeed) {
      item.speed *= 1.01;
      if (item.speed >= item.runSpeed) {
        item.speed = item.runSpeed;
      }
    }
    if (item.reverse) {
      item.x += item.speed;
      if (item.x > item.left) {
        item.x = 0;
      }
    } else {
      item.x -= item.speed;
      if (item.x < item.left) {
        item.x = 0;
      }
    }
    item.$el[0].style.willChange = 'transform';
    item.$el.css('transform', `translate3d(${item.x}px,0,0)`);
  });
  if (marquees.length) {
    requestAnimationFrame(animate);
  }
}

eventManager.addListener(eventTypes.route, 'marquee', function() {
  pageId++;
  marquees = [];
});

eventManager.addListener(eventTypes.loaded, 'marquee', function() {
  $('.marquee-container').marquee();
});


function marquee($el) {
  var marqueePage = pageId;
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
  start();

  function start() {
    if (marqueePage == pageId) {
      let notLoaded = $el.find('[data-lm]:not(.loaded)').length;
      if (notLoaded) {
        setTimeout(start, 250);
      } else {
        $marquee.removeClass('marquee-loading');
        appendExtra();
        addAnimation();
        marquees.length == 1 && animate();
      }
    }
  }

  function addAnimation() {
    var left = -$marquee.find('>*:eq(' + count + ')').position().left;
    var reverse = $el.hasClass('reverse');
    if (reverse) {
      left = $el.width() - $marquee.find('>*:eq(' + (count - 1) + ')').position().left;
    }
    left = Math.round(left);
    marquees.push({
      $el,
      left,
      reverse,
      x: 0,
      speed: $el.data('initspeed') || $el.data('speed'),
      runSpeed: $el.data('speed'),
    });
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
}

$.fn.marquee = function() {
  var $collection = this;
  $collection.each(function() {
    var $el = $(this);
    if (!$el.data('marquee')) {
      $el.data('marquee', 1);
      marquee($el);
    }
  });
  return $collection;
};

