import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import storage, {storageTypes} from 'setjs/kernel/storage.js';
import {addAction} from 'core/acts-funcs.js';

addAction('gdprAgree', function() {
  storage.set(storageTypes.gdpr, 1);
});

eventManager.addListener(eventTypes.init, 'gdpr', function() {
  var $body = $('body').toggleClass('gdpr-hide', storage.get(storageTypes.gdpr));

  eventManager.addListener(eventTypes.gdpr, 'gdpr', function(agreed) {
    $body.toggleClass('gdpr-hide', agreed);
  });
});
