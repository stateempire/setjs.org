import {storeValue, resetObject} from 'setjs/utility/objects.js';

function formJSON($form, data, resets) {
  resetObject(data, resets);
  $form.serializeArray().forEach(function(item){
    storeValue(data, item.name, item.value);
  });
}

function domJSON($el, data, resets) {
  var $marker = $('<div>').insertAfter($el);
  var $form = $('<form>').append($el);
  formJSON($form, data, resets);
  $marker.after($el).remove();
}

$.fn.formJSON = function(data, resets) {
  var $el = this;
  data = data || {};
  if ($el.filter('form').length) {
    formJSON($el, data, resets);
  } else {
    domJSON($el, data, resets);
  }
  return data;
};
