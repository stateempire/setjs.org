export function sort (items, prop, direction) {
  if (!items) {
     return;
  }
  direction = direction || 1;
  items.sort(function (a, b) {
     if (a[prop] > b[prop]) {
        return direction;
     }
     if (a[prop] < b[prop]) {
        return direction * -1;
     }
     return 0;
  });
  return items;
}

export function removeFromList(list, value) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] == value) {
      list.splice(i, 1);
      return i;
    }
  }
}

export function removeFromListByValue(list, value, prop1, prop2) {
  for (var i = list.length - 1; i >= 0 ; i--) {
    if (list[i][prop1] == value || (arguments.length > 3 && list[i][prop2] == value)) {
      list.splice(i, 1);
      return i;
    }
  }
}

export function indexOf(list, value, prop) {
  for (var i = 0; i < list.length; i++) {
     if ((prop ? list[i][prop] : list[i]) === value) {
        return i;
     }
  }
  return -1;
}

//Knuth-Fisher-Yates
export function shuffle(array) {
  var counter = array.length, temp, index;
  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

export function getUniqueList(list, prop) {
  var unique = [];
  var done = {};
  list.forEach(function(obj) {
    var thing = obj[prop];
    if (!done[thing]) {
      done[thing] = 1;
      unique.push(thing);
    }
  });
  return unique;
}

export function obtain(list, value, prop1, prop2, prop3) {
  for (var i = 0; i < list.length; i++) {
    if (list[i][prop1] == value || (arguments.length > 3 && list[i][prop2] == value) || (arguments.length > 4 && list[i][prop3] == value)) {
      return {index: i, val: list[i]};
    }
  }
}

export function getVal(list, value, prop) {
  var result = obtain(list, value, prop);
  return result && result.val;
}

export function randItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randItems(list, count) {
  return shuffle(list.slice()).slice(0, count);
}

export function spinIndex(limit, change, current = 0) {
  var index = current + change;
  limit = limit.length || limit;
  if (index < 0) {
    index += limit;
  }
  return index % limit;
}

export function listOverlap(list1, list2, prop) {
  var overlap = [];
  list1.forEach(one => {
    if (prop) {
      let found = obtain(list2, one[prop], prop);
      if (found) {
        overlap.push(one);
      }
    } else {
      if (list2.indexOf(one) >= 0) {
        overlap.push(one);
      }
    }
  });
  return overlap;
}
