import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

import './seo.js';
import siteInit from './site/init.js';

eventManager.addListener(eventTypes.loaded, 'init', function() {
  $('.code-block').each(function(i ,block) {
    hljs.highlightBlock(block);
  });
});

export default function({success}) {
  siteInit();
  success();
}
