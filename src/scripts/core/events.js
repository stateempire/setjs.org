import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {throttle} from 'setjs/utility/calls.js';

var documentTop = 0;

eventManager.addListener(eventTypes.loaded, 'events', function() {
  $('.js-scroll').on('scroll', function() {
    viewUpdate(null, $(this));
  });
});

export function viewUpdate(eventType, $el) {
  var height = $(window).height();
  var top = ($el || $(document)).scrollTop();
  var bottom = top + height;
  var change = top - documentTop;
  eventType && eventManager.raiseEvent(eventType, top, bottom, height, change);
  eventManager.raiseEvent(eventTypes.view, top, bottom, height, change);
  documentTop = top;
}

function createViewEvent(eventType, delay) {
  return throttle(function() {
    viewUpdate(eventType);
  }, delay || 20);
}

$(window).on('scroll', createViewEvent(eventTypes.scroll));
$(window).on('resize', createViewEvent(eventTypes.resize, 100));
