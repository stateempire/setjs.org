import getComp from 'setbp/template/component.js';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';

export default function() {
  var comp = getComp('common/footer');
  $('#footer-placeholder').replaceWith(comp.$root);
  eventManager.addListener(eventTypes.route, 'footer', comp.update, null);
}
