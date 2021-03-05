import eventManager from 'setjs/kernel/event-manager.js';
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
  var type = storeType.type;
  if (remove) {
    setTimeout(remove, 0, storeType); // remove after returning value, as an event could be raised
  }
  if (type == 'boolean') {
    val = +val == 1;
  } else if (type == 'number') {
    val = isNaN(val) ? 0 : +val;
  } else if (type == 'object') {
    try {
      val = JSON.parse(val);
      val = val && typeof val == 'object' ? val : def;
    } catch (e) {
      val = def;
    }
  } else {
    val = val || def || '';
  }
  return val;
}

function set(storeType, value) {
  if (storeType.type === 'object') {
    value = JSON.stringify(value || {});
  } else if (storeType.type === 'number') {
    value = isNaN(value) ? storeType.defaultValue || 0 : +value;
  } else if (storeType.type === 'boolean') {
    value = value ? 1 : 0;
  }
  if (storeType.memory) {
    memory[storeType.name] = value;
  } else {
    localStorage.setItem(storeType.name, value);
  }
  raise(storeType);
}

function toggle(storeType) {
  if (storeType.type !== 'boolean') {
    throw 'The value you want to toggle is not boolean.';
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
