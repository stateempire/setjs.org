import getComp from 'setjs/template/component.js';
import {addAction} from 'core/acts-funcs.js';

addAction('videoLightbox', function({arg}) {
  var mediaComp = getComp('common/video-lightbox', arg);
  mediaComp.$root.lightbox();
});
