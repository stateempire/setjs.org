import {addAction} from 'core/acts-funcs.js';

addAction('switchCode', function({$el, arg}) {
  $el.siblings().removeClass('active');
  $el.add($el.siblings('.' + arg)).addClass('active');
});
