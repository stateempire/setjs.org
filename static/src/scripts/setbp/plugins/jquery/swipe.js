import {normalizedEventCoords} from 'setbp/utility/mobile.js';

var startX = 0;
var startY = 0;
var diffX = 0;
var diffY = 0;
var startTime;
var swipeObj;

$(document).on('mouseup mouseleave touchend touchleave touchcancel', function() {
  if (swipeObj) {
    let movedX, movedY;
    if (Math.abs(diffY) > Math.abs(diffX)) {
      diffX = 0;
    } else {
      diffY = 0;
    }
    if (Math.abs(diffX) >= 6) {
      movedX = diffX > 0 ? -1 : 1;
    }
    if (Math.abs(diffY) >= 6) {
      movedY = diffY > 0 ? -1 : 1;
    }
    if (movedX || movedY) {
      swipeObj.swipe(movedX, movedY);
    }
    swipeObj = 0;
    if (Date.now() - startTime > 600 && (diffX > 5 || diffY > 5)) {
      return false;
    }
  }
});

$(document).on('mousemove touchmove', function (e) {
  if (swipeObj) {
    var {eX, eY} = normalizedEventCoords(e);
    diffX = eX - startX;
    diffY = eY - startY;
    swipeObj.move && swipeObj.move(diffX, diffY);
  }
});

$.fn.swipe = function(opts) {
  return this.on('mousedown touchstart', function(e) {
    var {eX, eY} = normalizedEventCoords(e);
    startX = eX;
    startY = eY;
    diffX = 0;
    diffY = 0;
    startTime = Date.now();
    swipeObj = opts;
  });
};
