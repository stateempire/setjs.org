import setjs from '@stateempire/setjs';
import {addAction} from 'core/acts-funcs.js';

addAction('videoLightbox', function({arg}) {
  var mediaComp = setjs.getComp('common/video-lightbox', arg);
  mediaComp.$root.lightbox();
});
