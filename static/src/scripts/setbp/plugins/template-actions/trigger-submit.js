import {addAction} from 'core/acts-funcs.js';

addAction('triggerSubmit', function(){
  $('#main-content form [type="submit"]').trigger('click');
});
