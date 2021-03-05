import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {normalizedEventCoords} from 'setjs/utility/mobile.js';

export default function($root, max, callback) {
  var startY = 0;
  var handleSwipe;
  var pos = 0;

  function processEvent(delta) {
    pos += delta / 1;
    pos = Math.max(0, Math.min(max, pos));
    callback(pos);
  }

  function handleWheel(e) {
    if (!handleSwipe) {
      processEvent(e.deltaY / 1);
    }
  }

  eventManager.addListener(eventTypes.wheel, 'tnw', handleWheel);

  $root.on('mousedown.tnw touchstart.tnw', function(e) {
    startY = normalizedEventCoords(e).eY;
    handleSwipe = 1;
  });

  $root.on('mousemove.tnw touchmove.tnw', function(e) {
    if (handleSwipe) {
      var {eY} = normalizedEventCoords(e);
      e.preventDefault();
      processEvent(startY - eY);
      startY = eY;
    }
  });

  $root.on('mouseup.tnw mouseleave.tnw touchend.tnw touchleave.tnw touchcancel.tnw', function() {
    handleSwipe = 0;
  });

  return function () {
    $root.off('.tnw');
    eventManager.removeListener(eventTypes.wheel, handleWheel);
  };
}
