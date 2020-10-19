import {addFuncs} from 'core/acts-funcs.js';
import {lazyMedia} from 'setbp/utility/lazy-media.js';
import {imgUrl} from 'helpers/misc.js';

addFuncs({
  cloudinaryLazy: function(path, {$el}, small, large) {
    $el.attr('src', imgUrl(path, small));
    lazyMedia({
      $el,
      type: 'src',
      url: imgUrl(path, large),
    });
  },
});
