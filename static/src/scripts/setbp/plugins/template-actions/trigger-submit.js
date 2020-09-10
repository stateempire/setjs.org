import {addAction} from 'core/acts-funcs.js';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

eventManager.addListener(eventTypes.route, 'body', function() {
  $('body').removeClass('loading');
});

addAction('triggerSubmit', function(){
  $('body').addClass('loading');
  $('#main-content form [type="submit"]').trigger('click');
});
