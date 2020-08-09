import setjs from '@stateempire/setjs';
import setup from 'config/setup.js';
import {loadAssets} from 'setbp/utility/assets.js';
import {batchCall} from 'setbp/utility/calls.js';

var errMsg = 'Unable to load page assets. Please check your connection and try again.';

export default function(page, route, progress) {
  return function(opts) {
    batchCall($.extend({progress}, opts))
    .add(setjs.ensureTemplates, {urls: setup.templateUrls(page.templates || []), jqErr: 1})
    .add(loadAssets, {urlSets: ('getAssets' in page && page.getAssets(route, page)) || page.assets, errMsg})
    .go();
  };
}
