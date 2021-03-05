import {sort, removeFromListByValue} from 'setjs/utility/array.js';
import eventTypes from 'config/event-types.js';

var events = {};

$.each(eventTypes, function (i, v) {
  events[v] = [];
});

var eventManager = {
  route: function(route) {
    eventManager.raiseEvent(eventTypes.init || eventTypes.route, route);
    delete events[eventTypes.init];
    eventTypes.init = 0;
  },
  addListener: function (type, config, method, data) {
    var listener = {priority: config.priority || 3, config, method, data, hasData: arguments.length > 3};
    events[type].push(listener);
    sort(events[type], 'priority');
    if (typeof method != 'function') {
      throw 'Not a function';
    }
    return listener;
  },
  removeListener: function (type, listener) {
    listener && removeFromListByValue(events[type], listener.method || listener, 'method');
  },
  raiseEvent: function (type, ..._args) {
    events[type].forEach(function (item) {
      var args = _args.slice();
      try {
        if (item.hasData) {
          args.unshift(item.data);
        }
        item.method(...args);
      } catch (e) {
        throw {type, item, args, e};
      }
    });
  }
};

eventManager.addListener(eventTypes.unload, {p: 'em', priority: 5}, function() {
  $.each(events, function(name, list) {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i].config.pageOnly) {
        list.splice(i, 1);
      }
    }
  });
});

export {eventTypes};
export default eventManager;

export function addEventListeners(types, ...args) {
  var listeners = [];
  types.forEach(function(type) {
    listeners.push(eventManager.addListener(type, ...args));
  });
  return listeners;
}
