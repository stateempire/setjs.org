import getComp from 'setjs/template/component.js';

var store = {};

$.fn.instagram = function(name) {
  var $el = this;
  loadInsta();
  return $el.addClass('loading');

  function loadInsta() {
    var url = 'https://www.instagram.com/' + name +'/?__a=1';
    if (store[name]) {
      render(name);
    } else {
      $.getJSON(url, function(res) {
        store[name] = res.graphql.user.edge_owner_to_timeline_media.edges;
        render(name);
      });
    }
  }

  function render(name) {
    var instaComp = getComp('common/instagram', {posts: store[name]});
    $el.removeClass('loading').append(instaComp.$root);
  }
};
