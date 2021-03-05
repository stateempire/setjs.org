import loader from 'Loader';
import getComp from 'setjs/template/component.js';
import setup from 'config/setup.js';
import {viewUpdate} from 'config/app-config.js';
import {testRole} from 'setjs/kernel/roles.js';
import storage, {storageTypes} from 'setjs/kernel/storage.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {serialCall} from 'setjs/utility/calls.js';
import {dummyPageFunc, getPage} from 'setjs/kernel/page-manager.js';
import {prePageAssets, postPageAssets} from 'core/asset-loader.js';

var loginManager, pageData, count = 1;

function setLoginManager(_loginManager) {
  loginManager = _loginManager;
}

function handleAuthError(type, cb) {
  return loginManager.handleAuthError(type, cb);
}

function showError(data, compName='common/error') {
  loader.loadContent(getComp(compName, typeof data == 'string' ? {msg: data} : data).$root, viewUpdate);
}

function authError() {
  showError({error_code: 403, errName: 'authError'});
}

function connectionError() {
  showError({errName: 'connectionError'});
}

function initError(result) {
  showError(result, 'init-error');
}

function notFound() {
  showError(null, 'common/404');
}

function unloadPage() {
  if (pageData && pageData.pageComp) {
    'unload' in pageData.page && pageData.page.unload(pageData);
    eventManager.raiseEvent(eventTypes.unload, pageData);
  }
  pageData = null;
}

function handleRoute(route) {
  let page = getPage(route.path);
  let oldPage = pageData && pageData.page;
  if (!page) {
    return notFound();
  }
  if (!setup.ssr() && oldPage == page && typeof oldPage.handleRoute == 'function' && !oldPage.handleRoute(pageData, route)) {
    viewUpdate();
  } else {
    loadPage(page, route);
  }
}

function loadPage(page, route) {
  let id = count++;
  let progressTimeout;

  unloadPage();
  loader.showBlank(route, page);
  if (!testRole((page.getRole && page.getRole(route)) || page.role)) {
    if (storage.get(storageTypes.token)) {
      return authError();
    } else {
      return loginManager.login();
    }
  }
  pageData = {id, page, route};
  eventManager.raiseEvent(eventTypes.loadStart, pageData);
  serialCall({
    condition: function() {
      return pageData.id == id;
    },
    error: function(actionOpts, ...args) {
      if (actionOpts && actionOpts.jqErr) {
        errorHandler(0, 0, args[0]);
      } else {
        errorHandler(actionOpts, ...args);
      }
    }
  })
  .add(prePageAssets(page, route, progress(10)))
  .add(page.once, pageData)
  .add(preload)
  .add(postAssets)
  .go();

  function progress(start) {
    return function({percent}) {
      loader.progress(start + percent / 10);
    };
  }

  function postAssets(opts, ...args) {
    clearTimeout(progressTimeout);
    postPageAssets(page, route, progress(90))({
      error: opts.error,
      success: function() {
        if (pageData.id == id) {
          pageData.pageComp = page.comp(pageData, ...args);
          eventManager.raiseEvent(eventTypes.loading, pageData);
          loader.loadContent(pageData.pageComp.$root, function() {
            typeof page.loaded == 'function' && page.loaded(pageData, ...args);
            eventManager.raiseEvent(eventTypes.loaded, pageData);
            viewUpdate();
          });
        }
      },
    });
  }

  function preload(opts) {
    page.once = dummyPageFunc; // initialized
    loader.progress(20 + Math.random() * 20);
    progressTimeout = setTimeout(loader.progress, 500, 40);
    eventManager.raiseEvent(eventTypes.preload, pageData);
    page.preload({
      page,
      route,
      progress: function(percent) {
        clearTimeout(progressTimeout);
        loader.progress(40 + percent / 2);
      },
      error: opts.error,
      success: opts.success
    });
  }

  function errorHandler(error, errors, jqXHR) {
    if (pageData.id == id) {
      if (error == 404 || (jqXHR && jqXHR.status == 404)) {
        notFound();
      } else if (error == 403 || (jqXHR && jqXHR.status == 403)) {
        authError();
      } else if (!error) {
        connectionError();
      } else {
        showError({msg: error, error_code: jqXHR && jqXHR.status});
      }
    }
  }
}

export default {handleRoute, handleAuthError, initError, connectionError, setLoginManager};
