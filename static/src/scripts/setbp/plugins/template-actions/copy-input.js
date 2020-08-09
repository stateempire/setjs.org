import setjs from '@stateempire/setjs';

setjs.addAction('copyInput', function(opts) {
  var $parent = opts.$el.parent();
  var $msg = $parent.find('.msg');
  var copyText = $parent.find('input')[0];
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand('copy');
  $msg.removeClass('hide');
  copyText.blur();
  setTimeout(function() {
    $msg.addClass('hide');
  }, 1000);
});
