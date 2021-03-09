import {addAction} from 'core/acts-funcs.js';

addAction('mcSubmit', mcSubmit);

function mcSubmit({$el, end}) {
  var $msg = $el.find('.mc-msg');
  var timeHandle;
  $el.removeClass('success error');
  $.ajax({
    url: $el.attr('action'),
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: $el.serialize(),
    error: function() {
      end();
      showError('Mail server not responding, try again later or turn off Incognito mode.');
    },
    success: function(data) {
      var result = data.result;
      var message = data.msg;
      end();
      if (result === 'success') {
        $el.addClass('success');
        $msg.text('Amazing, great to have you part of the list, we’ll be in touch');
      } else {
        if (message.indexOf('already subscribed') >= 0) {
          showError('It seems you’re already submitted your details, which is great! We\'ll be in touch.');
        } else {
          showError(message.replace('0 -', ''));
        }
      }
    },
  });

  function showError(message) {
    $msg.text(message);
    $el.addClass('error');
    clearTimeout(timeHandle);
    timeHandle = setTimeout(function() {
      $msg.text('');
      $el.removeClass('error');
    }, 3500);
  }
}
