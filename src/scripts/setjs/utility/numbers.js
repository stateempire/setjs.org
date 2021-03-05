var id = 0;

export function uniqueId(prefix) {
   id++;
   return (prefix ? prefix.toString() : 0) + id;
}

export function randomBool() {
    return Math.random() >= 0.5;
}

export function randInclusive(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

export function minMax(val, min, max) {
   return Math.min(max, Math.max(min, val));
}

export function guid() {
  function _p8(s) {
    var p = (Math.random().toString(16) + '000000000').substr(2,8);
    return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p ;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

// https://stackoverflow.com/a/29101013/2211098
export function roundNum(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

export function formatNumber(x) {
  return x.toString().replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// var alphabet = '0123456789';

// for (var i = 65; i < 91; i++) {
//   alphabet += String.fromCharCode(i);
//   alphabet += String.fromCharCode(i + 32);
// }

// export function randId(length) {
//   var id = '';
//   while (length--) {
//     id += alphabet[randInclusive(0, alphabet.length - 1)];
//   }
//   return id;
// }
