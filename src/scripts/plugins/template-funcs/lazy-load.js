import {addFuncs} from 'core/acts-funcs.js';
import {makeLazy, lazyImg} from 'setjs/utility/lazy-media.js';
import {imgCloud, responsiveWidth} from 'helpers/misc.js';

addFuncs({
  lazyImg: makeLazy('src'),
  lazyBg: makeLazy('bg'),
  lazyResponsive: function(url, {$el}) {
    url = (url[0] == '/' ? '' : '/') + url;
    $el.attr('src', `${imgCloud()}w_100,h_100,q_85,cs_srgb,c_limit/e_blur:300${url}`);
    setup();

    function setup() {
      if ($.contains(document.body, $el[0])) {
        lazyImg($el, `${imgCloud()}w_${responsiveWidth($el)},h_${responsiveWidth($el)},q_85,cs_srgb,c_limit${url}`);
      } else {
        setTimeout(setup, 500);
      }
    }
  }
});
