var $container = $('#main-content');
var $prev = $('.initial');
var blankTime = 0;
var animDuration = 400;
var $body = $('body');
var $blank = $('<div class="blank fadeout"><div class="upper"><div class="inner"></div></div><div class="lower"></div></div>').css({
  transform: 'translateY(100vh)',
  transition: 'all ' + animDuration + 'ms linear'
}).appendTo($body).hide();
var bodyStyle = {};
var durationOverride = 4000;
var bodyCls;

function progress() {}

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
    $blank.removeClass('animate').addClass('fadeout').css({transform: 'translateY(-100vh)'});
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
    loaded && loaded();
    $body.removeClass('loading');
    $content.find('[data-focus="true"]').focus();
    setTimeout(function() {
      $blank.css({transform: 'translateY(100vh)'}).hide();
    }, animDuration);
  }, Math.max(0, durationOverride - (Date.now() - blankTime)));
  durationOverride = animDuration;
}

function showBlank() {
  blankTime = Date.now();
  $blank.show().removeClass('animate fadeout').css({transform: 'translateY(0)'});
  setTimeout(function() { $blank.addClass('animate'); }, animDuration * 2);
}

export default {loadContent, showBlank, progress};
