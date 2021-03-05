import {setRoute} from 'setjs/kernel/setjs.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {normalizedEventCoords} from 'setjs/utility/mobile.js';

var clsIdentifier = 'g7H_c'; //unlikely class name

eventManager.addListener(eventTypes.resize, 'gallery', function() {
  $('.' + clsIdentifier).each(function() {
    $(this).data('gallery').setSize();
  });
});

$.fn.gallery = function() {
  var $parent = this;
  var isMoving, startTime, startX, left = 0;
  var $wrapper = $parent.find('.carousel-items');
  $parent.on('mousedown touchstart', start);
  $parent.on('mousemove touchmove', move);
  $parent.on('mouseup touchend', end);
  $parent.on('mouseleave touchleave touchcancel', end);
  $parent.find('.prev').click(prev);
  $parent.find('.next').click(next);
  setSize();
  return $parent.addClass(clsIdentifier).css('user-select', 'none').data('gallery', {setSize});

  function fit(offset) {
    var limit = $parent.width() - $wrapper.width();
    left += offset;
    if (left > 0) {
      left = 0;
    } else if (left < limit) {
      left = limit;
    }
    $wrapper.css({transition: 'transform 0.2s ease 0s', transform: `translate3d(${left}px, 0, 0)`});
  }

  function scroll(offset) {
    $wrapper.css({transition: 'transform 0.2s ease 0s', transform: `translate3d(${left + offset}px, 0, 0)`});
    setTimeout(fit, 200, offset);
  }

  function prev() {
    scroll($wrapper.find('>:first-child').outerWidth());
  }

  function next() {
    scroll(-$wrapper.find('>:first-child').outerWidth());
  }

  function setSize() {
    var width = 0;
    $wrapper.find('> *').each(function() {
      width += $(this).outerWidth(true);
    });
    $wrapper.css('width', width);
  }

  function start(e) {
    startTime = Date.now();
    startX = normalizedEventCoords(e).eX;
    $wrapper.css({transition: ''});
    isMoving = 1;
    return false;
  }

  function end(e) {
    var diffX = normalizedEventCoords(e).eX - startX;
    isMoving = 0;
    fit(diffX);
    if (e.which == 1 && Date.now() - startTime < 600 && Math.abs(diffX) < 6) {
      var dHref = $(e.target).closest('[data-href]').data('href');
      if (dHref) {
        setRoute(dHref);
      }
    }
  }

  function move(e) {
    if (isMoving) {
      $wrapper.css({transform: `translate3d(${left + normalizedEventCoords(e).eX - startX}px, 0, 0)`});
    }
  }
};
