import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {setDefData} from 'setjs/kernel/basics.js';

['init', 'route', 'user', 'lang'].forEach(function(name) {
  eventManager.addListener(eventTypes[name], {id: 'data', priority: 1}, function(data) {
    name = name == 'init' ? 'route' : name;
    setDefData(name, data);
  });
});

export default function(opts) {
  opts.success();
}
