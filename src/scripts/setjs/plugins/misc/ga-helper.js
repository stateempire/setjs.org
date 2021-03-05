import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

eventManager.addListener(eventTypes.route, 'ga-helper', function() {
  if (window.dataLayer && typeof window.dataLayer.push === 'function') {
    window.dataLayer.push({
        page: location.href,
        event: 'pageview',
      });
  }
});
