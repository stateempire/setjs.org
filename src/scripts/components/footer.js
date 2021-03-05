import getComp from 'setjs/template/component.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

/**
* Initializes the footer
*/
export default function() {
  var comp = getComp('common/footer');
  $('#footer-placeholder').replaceWith(comp.$root);
  eventManager.addListener(eventTypes.route, 'footer', comp.update, null);
}
