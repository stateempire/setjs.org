import setjs from '@stateempire/setjs';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

/**
* Initializes the footer
*/
export default function() {
  var comp = setjs.getComp('common/footer');
  $('#footer-placeholder').replaceWith(comp.$root);
  eventManager.addListener(eventTypes.route, 'footer', comp.update, null);
}
