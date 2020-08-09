import setjs from '@stateempire/setjs';

setjs.addFuncs({
  scrollTo: function(val, {$el}, selector, diff = 0, urlToUpdate) {
    diff = +diff;
    if (!$el.data('scrollToDone')) {
      $el.data('scrollToDone', 1).click(function() {
        $('html, body').animate({scrollTop: $(selector).offset().top + diff});
        if (urlToUpdate) {
          setjs.setRoute(urlToUpdate, 1);
        }
      });
    }
  },
});
