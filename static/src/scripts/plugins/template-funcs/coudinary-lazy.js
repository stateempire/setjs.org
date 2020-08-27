import {addFuncs} from 'core/acts-funcs.js';
import {lazyMedia} from 'setbp/utility/lazy-media.js';
import {assetUrl} from 'helpers/misc.js';

addFuncs({
  cloudinaryLazy: function(path, {$el}, small, large) {
    $el.attr('src', assetUrl(path, small));
    lazyMedia({
      $el,
      type: 'src',
      url: assetUrl(path, large),
    });
  },
});
