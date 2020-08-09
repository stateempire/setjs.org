import setjs from '@stateempire/setjs';
import eventManager, {eventTypes} from 'setbp/kernel/event-manager.js';
import pageLoader from 'setbp/kernel/page-loader.js';
import router from 'Router';
import setup from 'config/setup.js';

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
        setjs.setRoute(setjs.route().path);
      }
    });
  }
}

setjs.addAction('setLang', function({arg}) {
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
