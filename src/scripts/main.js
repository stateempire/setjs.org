import {startApp} from 'setjs/kernel/setjs.js';
import setup from 'config/setup.js';
import langHelper from 'setjs/kernel/lang-helper.js';
import initAppData from 'core/app-data.js';
import storage from 'setjs/kernel/storage.js';
import pageLoader from 'setjs/kernel/page-loader.js';
import {batchCall} from 'setjs/utility/calls.js';
import appInit from 'app/init.js';
import initialiseSetjs from 'core/setjs-init.js';
import {loadTemplates} from 'setjs/template/templates.js';
import appAssets from 'bootstrap/app-assets.js';

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
  .add(appAssets)
  .add(initAppData)
  .add(langHelper.initData)
  .go();
}
