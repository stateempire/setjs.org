import setjs from '@stateempire/setjs';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

/**
* Initializes the nav
*/
export default function() {
  var comp = setjs.getComp('common/navigation');
  $('#nav-placeholder').replaceWith(comp.$root);
  eventManager.addListener(eventTypes.lang, 'nav', comp.update, null);
  eventManager.addListener(eventTypes.route, 'nav', comp.update, null);
}
