import {getRoute} from 'setjs/kernel/setjs.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.loaded, 'navigation-docs', function() {
  $('[data-href="' + getRoute().path + '"]').addClass('active');
});
