import setjs from '@stateempire/setjs';
import {loader, viewUpdate} from 'config/app-config.js';
import {testRole} from 'setbp/kernel/roles.js';
import storage, {storageTypes} from 'setbp/kernel/storage.js';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';
import {serialCall} from 'setbp/utility/calls.js';
import {dummyPageFunc, getPage} from 'setbp/kernel/page-manager.js';
import assetLoader from 'core/asset-loader.js';

var loginManager, lastPage, count = 1;

function setLoginManager(_loginManager) {
  loginManager = _loginManager;
}

function handleAuthError(type) {
  return loginManager.handleAuthError(type);
}

function showError(data, compName='common/error') {
  loader.loadContent(setjs.getComp(compName, typeof data == 'string' ? {msg: data} : data).$root, viewUpdate);
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

function unloadLastPage() {
  if (lastPage && lastPage.comp) {
    lastPage.page.unload && lastPage.page.unload(lastPage);
    eventManager.raiseEvent(eventTypes.unload, lastPage);
  }
  lastPage = null;
}

function handleRoute(route) {
  if (lastPage && lastPage.page.handleRoute && lastPage.page.handleRoute(lastPage, route)) {
    viewUpdate();
  } else {
    loadPage(route);
  }
}

function loadPage(route) {
  let page = getPage(route.path);
  let id = count++;
  let progressTimeout;

  unloadLastPage();
  if (!page) {
    return notFound();
  }
  loader.showBlank(route, page);
  if (!testRole((page.getRole && page.getRole(route)) || page.role)) {
    if (storage.get(storageTypes.token)) {
      return authError();
    } else {
      return loginManager.login();
    }
  }
  lastPage = {id, page, route};
  eventManager.raiseEvent(eventTypes.loadStart, lastPage);
  serialCall({
    condition: function() {
      return lastPage.id == id;
    },
    error: function(actionOpts, ...args) {
      if (actionOpts && actionOpts.jqErr) {
        errorHandler(0, 0, args[0]);
      } else {
        errorHandler(...args);
      }
    }
  })
  .add(assetLoader(page, route, progress))
  .add(page.once, lastPage)
  .add(preload)
  .add(loadComp)
  .go();

  function progress({percent}) {
    loader.progress(10 + percent / 10);
  }

  function preload(opts) {
    page.once = dummyPageFunc; // initialized
    loader.progress(20 + Math.random() * 30);
    progressTimeout = setTimeout(loader.progress, 500, 40);
    eventManager.raiseEvent(eventTypes.preload, lastPage);
    page.preload({
      page,
      route,
      progress: function(percent) {
        clearTimeout(progressTimeout);
        loader.progress(50 + percent * 0.5);
      },
      error: opts.error,
      success: opts.success
    });
  }

  function loadComp(opts, ...args) {
    clearTimeout(progressTimeout);
    lastPage.comp = page.getComp(lastPage, ...args);
    eventManager.raiseEvent(eventTypes.loading, lastPage);
    loader.loadContent(lastPage.comp.$root, function() {
      page.loaded && page.loaded(lastPage, ...args);
      eventManager.raiseEvent(eventTypes.loaded, lastPage);
      viewUpdate();
    });
  }

  function errorHandler(error, errors, jqXHR) {
    if (lastPage.id == id) {
      if (error == 404 || (jqXHR && jqXHR.status == 404)) {
        notFound();
      } else if (jqXHR && jqXHR.status == 403) {
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
