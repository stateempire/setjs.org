import {setRoute} from 'setjs/kernel/setjs.js';
import {addFuncs} from 'core/acts-funcs.js';

addFuncs({
  scrollTo: function(val, {$el}, selector, diff = 0, urlToUpdate) {
    diff = +diff;
    if (!$el.data('scrollToDone')) {
      $el.data('scrollToDone', 1).click(function() {
        $('html, body').animate({scrollTop: $(selector).offset().top + diff});
        if (urlToUpdate) {
          setRoute(urlToUpdate, 1);
        }
      });
    }
  },
});
