import {storeValue} from 'setbp/utility/objects.js';

$.fn.formJson = function(data = {}) {
  this.serializeArray().forEach(function(item){
    storeValue(data, item.name, item.value);
  });
  return data;
};
