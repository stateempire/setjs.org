import {ensureTemplates} from 'setjs/template/templates.js';
import setup from 'config/setup.js';
import {loadAssets} from 'setjs/utility/assets.js';
import {batchCall} from 'setjs/utility/calls.js';

var errMsg = 'Unable to load page assets. Please check your connection and try again.';
var preFuncs = [];
var postFuncs = [];

function createBatch(list, page, route, progress, callbacks) {
  var data = {page, route};
  var bc = batchCall($.extend({progress}, callbacks));
  list.forEach(func => {
    bc.add(func, data);
  });
  return bc;
}

export function addAssetFunc(func, postFunc) {
  if (postFunc) {
    postFuncs.push(func);
  } else {
    preFuncs.push(func);
  }
}

export function prePageAssets(page, route, progress) {
  return function(callbacks) {
    createBatch(preFuncs, page, route, progress, callbacks)
    .add(ensureTemplates, {urls: setup.templateUrls(page.templates || []), jqErr: 1})
    .add(loadAssets, {urlSets: ('getAssets' in page && page.getAssets(route, page)) || page.assets, errMsg})
    .go();
  };
}

export function postPageAssets(page, route, progress) {
  return function(callbacks) {
    createBatch(postFuncs, page, route, progress, callbacks).go();
  };
}
