import {addFuncs} from 'core/acts-funcs.js';
import PrismicDOM from 'prismic-dom';

addFuncs({
  prismicText: function(text, {$el}) {
    $el.html(PrismicDOM.RichText.asHtml(text));
  },
});
