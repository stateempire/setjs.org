import {addAction} from 'core/acts-funcs.js';
import {api} from 'core/api-helper.js';

addAction('genericSubmit', function({comp, $el, success, error, arg}) {
  var apiName = $el.data('api');
  var isJSON = arg != 'form';
  api[apiName]({
    isJSON,
    data: isJSON ? $el.formJSON() : $el.serialize(),
    success: function(res) {
      var successCb = comp.actions[apiName];
      success(res);
      successCb && successCb(res);
    },
    error,
  });
});
