import getComp from 'setjs/template/component.js';
import {addFuncs} from 'core/acts-funcs.js';

addFuncs({
  instagramGrid: function(val, {$el}, name, count = 5) {
    if (!$el.data('instaInit')) {
      $el.data('instaInit', 1);
      $.getJSON('https://www.instagram.com/' + name +'/?__a=1', function(res) {
        var instaComp = getComp('common/instagram-grid', {posts: res.graphql.user.edge_owner_to_timeline_media.edges.slice(0, +count)});
        $el.append(instaComp.$root);
      });
    }
  },
});
