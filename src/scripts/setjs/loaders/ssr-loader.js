var $container = $('#main-content');
var $prev = $('.initial');
var $body = $('body');
var bodyStyle = {};
var bodyCls;

function progress() {}

function loadContent($content) {
  var bodyCss;
  if (typeof $content === 'string') {
    $content = $($content);
  }
  bodyCss = $content.data('css');
  if (typeof bodyCss != 'object') {
    bodyCss = {};
  }
  $prev.remove();
  $prev = $content;
  $container.append($content);
  $.each(bodyStyle, function(key) {
    $body.css(key, '');
  });
  $body.attr('id', $content.data('id') || ($content.data('template') || '').replace(/\//g, '-'))
       .removeClass(bodyCls)
       .addClass($content.data('class'))
       .css(bodyCss);
  bodyCls = $content.data('class');
  bodyStyle = bodyCss;
  console.log('This is SSR mode loader');
}

function showBlank() {}

export default {loadContent, showBlank, progress};
