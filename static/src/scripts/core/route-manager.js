import {setRoute, prevRoute} from 'setbp/kernel/setjs.js';
import storage, {storageTypes} from 'setbp/kernel/storage.js';
import eventManager from 'setbp/kernel/event-manager.js';
import pageLoader from 'setbp/kernel/page-loader.js';
import alertBox from 'setbp/ui/alert-box.js';

var pendingMsg;

window.addEventListener('beforeunload', (event) => {
  if (pendingMsg) {
    event.preventDefault();
    event.returnValue = '';
  }
});

function processRoute(route) {
  eventManager.route(route);
  pageLoader.handleRoute(route);
}

function allowRoute(route) {
  var {pageId} = route;
  if (pendingMsg) {
    alertBox({
      message: pendingMsg,
      noTxt: 'Stay',
      okTxt: 'Leave',
      no: function(alertController) {
        alertController.close();
        setRoute(prevRoute().path, 1);
      },
      ok: function(alertController) {
        pendingMsg = 0;
        alertController.close();
        handleRoute(route);
      },
    });
  } else if (['login', 'forgot-password'].indexOf(pageId) >= 0 && storage.get(storageTypes.token)) {
    setRoute();
  } else {
    return 1;
  }
}

export function setPending(msg) {
  pendingMsg = msg;
}

export default function handleRoute(route) {
  if (allowRoute(route)) {
    processRoute(route);
  }
}
