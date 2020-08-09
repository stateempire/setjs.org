import setjs from '@stateempire/setjs';
import router from 'Router';
import {defData} from 'core/app-data.js';
import handleRoute from 'core/route-manager.js';
import langHelper from 'setbp/kernel/lang-helper.js';

var lastLinkClick = 0;

function fixPath(pathStr) {
  return pathStr.replace(/\/{2,}/g, '/').replace(/(.+)\/$/, '$1');
}

function getLink(subRoute) {
  let lang = langHelper.lang();
  return fixPath('/' + (lang ? lang + '/' : '')  + (subRoute || ''));
}

function compUpdate($selection) {
  $selection.find('[data-href]').addBack('[data-href]').each(function(i, el) {
    var $link = $(el);
    var dHref = $link.attr('data-href');
    if ($link.data('dHref') != dHref && !$link.closest('[data-no-links]').length) {
      if ($link.attr('target') != '_blank') {
        $link.off('.hr').on('click.hr', function(e) {
          if (!e.metaKey) {
            e.preventDefault();
            if (Date.now() - lastLinkClick > 900) {
              setjs.setRoute(dHref);
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
    if (e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
      args._e = e;
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
        if (comp.$formMsg) {
          comp.$formMsg.text(message || '');
        }
      };
    }
    func(args);
  }
}

export default function() {
  setjs.init({
    router,
    defData,
    handleRoute,
    fixPath,
    getLink,
    compUpdate,
    handleEvent,
    lang: langHelper.lang,
  });
}
