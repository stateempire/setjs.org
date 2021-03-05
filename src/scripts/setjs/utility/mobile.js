// https://stackoverflow.com/a/4819886/2211098
export function isTouchDevice() {
  var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  var mq = function(query) {
    return window.matchMedia(query).matches;
  };

  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

export function normalizedEventCoords(e) {
  if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
    e = e.originalEvent.changedTouches[0];
  }
  return {eX: e.clientX, eY: e.clientY};
}
