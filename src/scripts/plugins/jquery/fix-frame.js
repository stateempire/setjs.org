import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

var active = [];

function createCallback(method) {
  return function() {
    for (var i = 0; i < active.length; i++) {
      if ($.contains(document.body, active[i].$el[0])) {
        active[i][method]();
      }
    }
  };
}

$(window).on('scroll', createCallback('run'));
eventManager.addListener(eventTypes.resize, 'fix-frame', createCallback('calc'));
eventManager.addListener(eventTypes.route, 'fix-frame', function() {
  active = [];
});


$.fn.fixFrame = function() {
  var $frame = this;
  var $parent = $frame.parent();
  var $frames = $parent.find('.frames');
  var $first = $frames.first().find('>*:first-child');
  var $last = $frames.last().find('>*:last-child');
  var $video = $frame.find('.asset');
  var item = {
    $el: $parent,
    calc: function() {
      item.height = floor($video.height());
      item.run();
    },
    run: function() {
      var navHeight = floor($('#breadcrumbs').height());
      var top = floor($first[0].getBoundingClientRect().top);
      var bottom = floor($last[0].getBoundingClientRect().top + $last.height());
      if (!item.height) {
        item.height = floor($video.height());
      }
      if (top <= navHeight) {
        let isFixed = bottom > navHeight + item.height;
        if (isFixed && !$video.hasClass('fixed')) {
          $video.removeClass('bottom').addClass('fixed').css({top: navHeight});
        } else if (!isFixed && !$video.hasClass('bottom')) {
          $video.removeClass('fixed').addClass('bottom').css({top: '', bottom: 0});
        }
      } else {
        $video.removeClass('fixed bottom').css('top', '');
      }
    }
  };
  active.push(item);
  return $frame;

  function floor(val) {
    return Math.floor(val);
  }
};
