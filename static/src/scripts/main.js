import {startApp} from 'setbp/kernel/setjs.js';
import setup from 'config/setup.js';
import langHelper from 'setbp/kernel/lang-helper.js';
import initAppData from 'core/app-data.js';
import storage from 'setbp/kernel/storage.js';
import pageLoader from 'setbp/kernel/page-loader.js';
import {batchCall} from 'setbp/utility/calls.js';
import appInit from 'app/init.js';
import initialiseSetjs from 'core/setjs-init.js';
import {loadTemplates, ensureTemplates} from 'setbp/template/templates.js';

import 'bootstrap/plugin-init.js';
import 'bootstrap/component-init.js';

export function start(settings) {
  setup.init(settings);
  storage.init();
  langHelper.init();
  loadTemplates($('#init-error').html());
  initialiseSetjs();
  batchCall({
    error: pageLoader.initError,
    success: function() {
      appInit({
        error: pageLoader.initError,
        success: startApp,
      });
    }
  })
  .add(ensureTemplates, {urls: setup.templateUrls(['common'])})
  .add(initAppData)
  .add(langHelper.initData)
  .go();
}
