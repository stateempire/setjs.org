import setjs from '@stateempire/setjs';
import pageLoader from 'setbp/kernel/page-loader.js';
import storage, {storageTypes} from 'setbp/kernel/storage.js';
import setup from 'config/setup.js';

export let api = {};

export function addApis(apis) {
  Object.keys(apis).forEach(function(key) {
    if (api[key]) {
      throw key + ' is already defined in api-helper.';
    }
  });
  $.extend(api, apis);
}

export function dataGet(url, opts) {
  ajaxCall($.extend({useData: 1}, opts, {type: 'GET', relativeUrl: url}));
}

export function dataFunc(url) {
  return function(opts) {
    dataGet(url, opts);
  };
}

export function jsonSave(url, type, opts) {
  ajaxCall($.extend({isJSON: 1}, opts, {type, relativeUrl: url}));
}

export function jsonFunc(url, type = 'POST') {
  return function(opts) {
    jsonSave(`${url}${opts.urlSeg || ''}`, type, opts);
  };
}

export function getById(url, id = 'id') {
  return function(opts) {
    dataGet(`${url}/${setjs.getProp(id, opts)}`, opts);
  };
}

export function getWithUrlSeg(url) {
  return function(opts) {
    dataGet(`${url}${opts.urlSeg || ''}`, opts);
  };
}

export function saveById(url, id = 'data.uuid') {
  return function(opts) {
    jsonSave(url, setjs.getProp(id, opts) ? 'PUT' : 'POST', opts);
  };
}

/**
 * Consolidate Ajax Call
 * @param {Object} opts - The options object
 */
export function ajaxCall({isJSON, relativeUrl, type, data, success, error, complete, ignore401, noToken, useData}) {
  var token = storage.get(storageTypes.token);
  var headers = (token && !noToken) ? {[setup.authHeader()]: 'Bearer ' + token} : null;
  var ajaxSettings = {
    url: setup.api_url() + relativeUrl,
    type: type || 'POST',
    headers,
    data,
    success, // res, textStatus, jqXHR
    complete,
    error: function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401 && !ignore401 && pageLoader.handleAuthError(type)) {
        return;
      }
      var responseObj = jqXHR.responseJSON || {};
      var errorMsg = 'Could not connect. Please try later.';
      let errors = responseObj.data;
      if (jqXHR.responseJSON) {
        errorMsg = responseObj.message || 'There was an error. Please try later.';
      } else if (errorThrown) {
        errorMsg = errorThrown;
      }
      if (Array.isArray(errors) && errors.length == 1) {
        errorMsg = errors[0];
      }
      error && error(errorMsg, errors, jqXHR);
    },
  };
  if (isJSON) {
    ajaxSettings.data = typeof data == 'string' ? data : JSON.stringify(data);
    ajaxSettings.contentType = 'application/json';
  }
  if (useData) {
    ajaxSettings.success = function(res) {
      success(res.data, res);
    };
  }
  $.ajax(ajaxSettings);
}
