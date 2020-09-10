import {storeValue, resetObject} from 'setbp/utility/objects.js';

$.fn.formJson = function(data, resets) {
  data = data || {};
  resetObject(data, resets);
  this.serializeArray().forEach(function(item){
    storeValue(data, item.name, item.value);
  });
  return data;
};
