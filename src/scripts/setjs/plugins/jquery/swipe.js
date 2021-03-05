import {normalizedEventCoords} from 'setjs/utility/mobile.js';

var startX;
var startY;
var diffX;
var diffY;
var lastX;
var speed;
var speedTime;
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
      swipeObj.swipe({movedX, movedY, diffX, diffY, speed: Date.now() - speedTime < 100 ? speed : 0});
    }
    swipeObj = 0;
  }
});

$(document).on('mousemove touchmove', function (e) {
  if (swipeObj) {
    var {eX, eY} = normalizedEventCoords(e);
    var oldSpeed = speed;
    diffX = eX - startX;
    diffY = eY - startY;
    swipeObj.move && swipeObj.move(diffX, diffY);
    speed = Math.abs(lastX - eX) / (Math.max(1, Date.now() - speedTime));
    speed = ((oldSpeed || speed) + speed) / 2;
    lastX = eX;
    speedTime = Date.now();
    return false;
  }
});

$.fn.swipe = function(opts) {
  return this.on('mousedown touchstart', function(e) {
    var {eX, eY} = normalizedEventCoords(e);
    lastX = startX = eX;
    startY = eY;
    diffX = 0;
    diffY = 0;
    speedTime = Date.now();
    swipeObj = opts;
  });
};
