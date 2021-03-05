import setjs from 'setjs/kernel/setjs.js';
import {act} from 'core/acts-funcs.js';

var events = {
  down: 'mousedown touchstart',
  up: 'mouseup touchend',
  out: 'mouseleave touchleave touchcancel',
  move: 'mousemove touchmove',
  form: 'submit',
};

export function bindEvents($el, comp, data, actions) {
  let name = $el.data('name');
  let acts = ($el.data('act') || '').split(' ');
  acts.forEach(function(action) {
    $el.on(events[action] || action, function(e) {
      var funcName = $el.data('func') || action;
      var args = {$el, name, action, comp, e, data, arg: $el.data('arg')};
      setjs.handleEvent(args, actions[funcName] || act(funcName));
    });
  });
}
