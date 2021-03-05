import moment from 'moment';

var cal = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'MMMM Do, YYYY.',
};

export function calenderDay(momentTime) {
  return momentTime.calendar(null, cal);
}

export function formatTimespan(times, seconds) {
  var startTime = moment(times.start, 'hh');
  var endTime = moment(times.end, 'hh');
  return {
    startTime: moment(startTime).add(seconds, 's'),
    endTime: moment(endTime).add(seconds, 's'),
    timeText: startTime.format('ha') + ' - ' + endTime.format('ha')
  };
}
