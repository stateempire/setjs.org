var $container = $('#main-content');
var $prev = $('.initial');
var blankTime = 0;
var animDuration = 500;
var $body = $('body');
var $blank = $('<div class="fadeout-transition"></div>').appendTo($body).hide();
var bodyStyle = {};
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
    $blank.fadeOut(animDuration);
    $('html,body').scrollTop(0);
    $.each(bodyStyle, function(key) {
      $body.css(key, '');
    });
    $body.attr('id', $content.data('id') || ($content.data('template') || '').replace(/\//g, '-'))
         .removeClass(bodyCls)
         .removeClass('checkout')
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
  $blank.removeClass('animate').fadeIn(0);
  setTimeout(function () { $blank.addClass('animate'); }, animDuration * 2);
}

export default {loadContent, showBlank, progress};
