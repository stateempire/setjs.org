var $container = $('#main-content');
var $prev = $('.initial');
var blankTime = 0;
var animDuration = 300;
var $body = $('body');
var $bar = $('<div class="progress-bar">').appendTo($body).hide();
var bodyStyle = {};
var bodyCls;

function progress(percent) {
  $bar.css({width: Math.min(100, percent) + '%'});
}

function loadContent($content, loaded) {
  setTimeout(function() {
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
    $bar.css({width: '100%'}).fadeOut(animDuration);
    $('html,body').scrollTop(0);
    $.each(bodyStyle, function(key) {
      $body.css(key, '');
    });
    $body.attr('id', $content.data('id') || ($content.data('template') || '').replace(/\//g, '-'))
         .removeClass(bodyCls)
         .addClass($content.data('class'))
         .css(bodyCss);
    bodyCls = $content.data('class');
    bodyStyle = bodyCss;
    $content.find('[data-focus="true"]').focus();
    loaded && loaded();
  }, Math.max(0, animDuration - (Date.now() - blankTime)));
}

function showBlank() {
  blankTime = Date.now();
  $bar.css({width: 0}).show();
}

export default {loadContent, showBlank, progress};
