import {fatal} from 'setjs/kernel/basics.js';

export function storeItemByName(comp, name, item) {
  if (comp[name]) {
    fatal('Repeat name', name);
  }
  comp[name] = item;
}

export function funcWithSelf($el, dataName, func) {
  findWithSelf($el, dataName).each(function(i, item) {
    var $item = $(item);
    func($item, $item.data(dataName));
  });
}

export function findWithSelf($el, dataName) {
  dataName = '[data-' + dataName + ']';
  return $el.find(dataName).addBack(dataName);
}
