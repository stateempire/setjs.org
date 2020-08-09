import setjs from '@stateempire/setjs';

setjs.addAction('triggerSubmit', function(){
  $('#main-content form button[type="submit"]').trigger('click');
});
