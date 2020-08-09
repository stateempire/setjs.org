import eventManager from 'setbp/kernel/event-manager.js';
import storageTypesInit from 'config/storage-types.js';
export {storageTypes} from 'config/storage-types.js';

var memory = {};
var store = {
  init: function() {
    storageTypesInit();
    $.extend(store, {get, set, toggle, remove});
  }
};

function raise(storeType) {
  if (storeType.eventAfter) {
    eventManager.raiseEvent(storeType.eventAfter, get(storeType));
  }
}

function get(storeType, remove) {
  var val = memory[storeType.name] || localStorage.getItem(storeType.name);
  var def = storeType.defaultValue;
  if (remove) {
    setTimeout(remove, 0, storeType); // remove after returning value
  }
  switch (storeType.type) {
    case 'boolean':
      return +val === 1;
    case 'number':
      return +val || 0;
    case 'object':
      try {
        return JSON.parse(val) || def;
      } catch (e) {
        return def;
      }
    default:
      return val || def || '';
  }
}

function set(storeType, value, inMemory) {
  if (storeType.type === 'object') {
    value = JSON.stringify(value || {});
  } else if (storeType.type === 'number') {
    value = +value || 0;
    if (typeof value !== 'number') {
      value = storeType.defaultValue || 0;
    }
  } else if (storeType.type === 'boolean') {
    value = value ? 1 : 0;
  }
  if (inMemory) {
    memory[storeType.name] = value;
  } else {
    localStorage.setItem(storeType.name, value);
  }
  raise(storeType);
}

function toggle(storeType) {
  if (storeType.type !== 'boolean') {
    throw {msg: 'The value you want to toggle is not boolean.'};
  }
  var newVal = !get(storeType);
  set(storeType, newVal);
  return newVal;
}

function remove(storeType) {
  delete memory[storeType.name];
  localStorage.removeItem(storeType.name);
  raise(storeType);
}

export default store;
