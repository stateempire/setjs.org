import {initSetjs, setRoute} from 'setjs/kernel/setjs.js';
import {funcWithSelf} from 'setjs/utility/comp-helpers.js';
import langHelper from 'setjs/kernel/lang-helper.js';
import handleRoute from 'core/route-manager.js';

var lastLinkClick = 0;

function fixPath(pathStr) {
  if (RegExp('account/(confirm|reset-password)/.+/').test(pathStr)) {
    return pathStr;
  }
  return pathStr.replace(/\/{2,}/g, '/').replace(/(.+)\/$/, '$1');
}

function getLink(subRoute) {
  let lang = langHelper.lang();
  return fixPath('/' + (lang ? lang + '/' : '')  + (subRoute || ''));
}

function compUpdate($selection) {
  funcWithSelf($selection, 'href', function($link) {
    let dHref = $link.attr('data-href');
    if ($link.data('dHref') != dHref && !$link.closest('[data-no-links]').length) {
      if ($link.attr('target') != '_blank') {
        $link.off('.hr').on('click.hr', function(e) {
          if (!e.metaKey) {
            e.preventDefault();
            if (Date.now() - lastLinkClick > 900) {
              setRoute(dHref);
              lastLinkClick = Date.now();
            }
          }
        });
      }
      $link.data('dHref', dHref).attr('href', getLink(dHref));
    }
  });
}

function handleEvent(args, func) {
  let {comp, $el, action, e} = args;
  if (comp.busy || e.type == 'submit' || $el.data('stop')) {
    // Do this early to avoid default browser action in case of errors
    e.preventDefault();
    e.stopPropagation();
  }
  if (!comp.busy) {
    args._e = e;
    if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
      args.e = e.originalEvent.changedTouches[0];
    }
    if (action == 'form') {
      let $button = $el.find('[type="submit"]');
      comp.busy = true;
      $button.prop('disabled', true);
      $el.addClass('loading').removeClass('error success');
      args.error = function(message) {
        args.end('error', message);
      };
      args.success = function(messageObj) {
        args.end('success', (messageObj && messageObj.message) || messageObj);
      };
      args.end = function(cls, message) {
        comp.busy = false;
        $el.removeClass('loading').addClass(cls);
        $button.prop('disabled', false);
        $('body').removeClass('loading');
        if (comp.$formMsg) {
          comp.$formMsg.text(message || '');
        }
      };
    }
    func(args);
  }
}

export default function() {
  initSetjs({
    fixPath,
    getLink,
    compUpdate,
    handleEvent,
    handleRoute,
    lang: langHelper.lang,
  });
}
