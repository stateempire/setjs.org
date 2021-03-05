export function capitalize(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

//https://stackoverflow.com/a/8831937/2211098
//https://github.com/darkskyapp/string-hash
export function getStrHash(str) {
  var hash = 5381, i = (str && str.length) || 0;
  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

/**
 * A simple solution to replace variables in templates
 * http://javascript.crockford.com/remedial.html
 * @param {string} string
 * @param {string} o
 * @return {string}
 */
export function supplant(string, o) {
    return string.replace(/{([^{}]*)}/g,
      function(a, b) {
        var r = o,
        parts = b.split('.');
        for (var i = 0; r && i < parts.length; i++) {
          r = r[parts[i]];
        }
        return typeof r === 'string' || typeof r === 'number' ? r : a;
      }
    );
}

/**
 * getInitials - Create initials from full name
 * @param {string} name - full name
 * @return {string} - The initials
*/
export function getInitials(name) {
  var initials;
  try {
    initials = name.toUpperCase().match(/\b\w/g);
    if (initials.length > 1) {
      initials = initials.shift() + initials.pop();
    } else {
      initials = initials.shift();
    }
  } catch (e) {
    initials = name.charAt(0);
  }

  return initials;
}

export function prettyTime(num) {
    return (num < 10 ? '0' : '') + num;
}

export function timeToText(ms) {
    var total_seconds = ms / 1000;
    var hours = Math.floor(total_seconds / 3600);
    total_seconds = total_seconds % 3600;
    var minutes = Math.floor(total_seconds / 60);
    total_seconds = total_seconds % 60;
    var seconds = Math.floor(total_seconds);

    hours = prettyTime(hours);
    minutes = prettyTime(minutes);
    seconds = prettyTime(seconds);
    return hours + ':' + minutes + ':' + seconds;
}

// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
export function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;';
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');
  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
