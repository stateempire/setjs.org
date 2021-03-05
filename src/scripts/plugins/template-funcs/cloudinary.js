import {addFuncs} from 'core/acts-funcs.js';
import {lazyMedia} from 'setjs/utility/lazy-media.js';
import {imgUrl, imgCloud, vidCloud, responsiveWidth} from 'helpers/misc.js';

addFuncs({
  cloudinaryLazy: function(path, {$el}, small, large) {
    $el.attr('src', imgUrl(path, small));
    lazyMedia({
      $el,
      type: 'src',
      url: imgUrl(path, large),
    });
  },
  isGif: function(path) {
    return /.gif$/.test(path);
  },
  vidSrc: function(path, {$el}) {
    let cloudUrl = /.gif$/.test(path) ? imgCloud() : vidCloud();
    setup();
    function setup() {
      if ($.contains(document.body, $el[0])) {
        let url = cloudUrl + `w_${responsiveWidth($el)},h_${responsiveWidth($el)},vc_auto,c_limit/q_auto:best/` + path.slice(0, 1 - (path.length - path.lastIndexOf('.')));
        $el.append(`<source type='video/webm' src="${url}webm">`, `<source type='video/mp4' src="${url}mp4">`);
      } else {
        setTimeout(setup, 500);
      }
    }
  },
});
