import {getRoute, setRoute} from 'setjs/kernel/setjs.js';
import router from 'Router';
import setup from 'config/setup.js';
import {addAction} from 'core/acts-funcs.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import pageLoader from 'setjs/kernel/page-loader.js';

var languages, lang, langData;

function isSupported(lang) {
  return languages.indexOf(lang) >= 0;
}

function initData({success, error}) {
  if (!lang) {
    success();
  } else {
    $.getJSON(`/data/lang/${lang}.json?t=${setup.timestamp()}`)
      .done(function(_langData) {
        _langData.lang = lang;
        langData = _langData;
        eventManager.raiseEvent(eventTypes.lang, langData);
        success();
      })
      .fail(error);
  }
}

function setLang(_lang) {
  _lang = _lang || languages[0];
  if (isSupported(_lang)) {
    lang = _lang;
    initData({
      error: pageLoader.connectionError,
      success: function() {
        setRoute(getRoute().path);
      }
    });
  }
}

addAction('setLang', function({arg}) {
  setLang(arg);
});

export default {
  setLang,
  initData,
  init: function() {
    languages = setup.languages() || [];
    if (languages.length) {
      lang = router.getPath().split('/')[0];
      lang = isSupported(lang) ? lang : languages[0];
    }
    lang = lang || setup.dataFile();
  },
  lang: function() {
    return languages.length ? lang : '';
  },
  isRtl: function(lang) {
    return lang == 'ar';
  },
  data: function() {
    return langData;
  }
};
