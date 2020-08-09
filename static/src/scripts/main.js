import setjs from '@stateempire/setjs';
import setup from 'config/setup.js';
import langHelper from 'setbp/kernel/lang-helper.js';
import initAppData from 'core/app-data.js';
import storage from 'setbp/kernel/storage.js';
import pageLoader from 'setbp/kernel/page-loader.js';
import {batchCall} from 'setbp/utility/calls.js';
import appInit from 'app/init.js';
import initialiseSetJs from 'core/setjs-init.js';

import 'bootstrap/plugin-init.js';
import 'bootstrap/component-init.js';

export function start(settings) {
  setup.init(settings);
  storage.init();
  langHelper.init();
  setjs.loadTemplates($('#init-error').html());
  initialiseSetJs();
  batchCall({
    error: pageLoader.initError,
    success: function() {
      appInit({
        error: pageLoader.initError,
        success: setjs.start,
      });
    }
  })
  .add(setjs.ensureTemplates, {urls: setup.templateUrls(['common'])})
  .add(initAppData)
  .add(langHelper.initData)
  .go();
}
