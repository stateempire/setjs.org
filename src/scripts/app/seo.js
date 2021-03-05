import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import langHelper from 'setjs/kernel/lang-helper.js';
import router from 'Router';
import setup from 'config/setup.js';

const $head = $('head');

eventManager.addListener(eventTypes.loadStart, 'seo', function({route}) {
  let prop = langHelper.data();
  let parts = route.path.split('/');
  let {title, subTitle, description, image} = prop.home.meta;

  while (prop && parts.length) {
    prop = prop[parts.shift()];
    if (prop && prop.meta) {
      title = prop.meta.title || title;
      subTitle = prop.meta.subTitle || subTitle;
      description = prop.meta.description || description;
    }
  }
  if (subTitle) {
    title += ' — ' + subTitle;
  }
  document.title = title;
  $head.find('link[rel="image_src"]').attr('content', image);
  $head.find('[name="description"]').attr('content', description);
  $head.find('[property="og:title"]').attr('content', title);
  $head.find('[property="og:description"]').attr('content', description);
  $head.find('[property="og:image"]').attr('content', image);
  $head.find('[property="twitter:title"]').attr('content', title);
  $head.find('[property="twitter:description"]').attr('content', description);
  $head.find('[property="twitter:image"]').attr('content', image);
  $head.find('link[rel="alternate"]').remove();
  if (route.lang) {
    let pathPrefix = window.location.origin + router.prefix;
    setup.languages().forEach(function(lang) {
      if (lang !== route.lang) {
        var $el = $('<link rel="alternate">')
                    .attr('hreflang', {cn: 'zh-TW'}[lang] || lang)
                    .attr('href', pathPrefix + lang + (route.path ? '/' + route.path : ''));
        $head.append($el);
      }
    });
  }
});
