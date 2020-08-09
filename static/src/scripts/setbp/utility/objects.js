export function storeValue(target, name, value) {
  var props = name.split('.');
  props.forEach(function(prop, index) {
    if (index == props.length - 1) {
      let isArray = prop.length > 2 && prop.slice(-2) == '[]';
      if (isArray) {
        prop = prop.slice(0, -2);
        target[prop] = target[prop] || [];
        target[prop].push(value);
      } else {
        target[prop] = value;
      }
    } else {
      target = target[prop] = target[prop] || {};
    }
  });
}
