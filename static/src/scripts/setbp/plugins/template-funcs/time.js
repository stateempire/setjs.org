import {addFuncs} from 'core/acts-funcs.js';

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'Octomber', 'November', 'December'];

addFuncs({
  showDate: function(time, {$el}) {
    var d = new Date(time);
    $el.text(`${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`);
  },
});
