import moment from 'moment';
import setjs from '@stateempire/setjs';

setjs.addFuncs({
  moment: function(time, {$el}, format) {
    format = format || 'MMMM Do, YYYY.';
    $el.text((time && time._isAMomentObject ? time : moment(time)).format(format));
  },
  fromNow: function(time, {$el}) {
    $el.text(moment(time).fromNow());
  },
});
