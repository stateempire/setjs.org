import setup from 'config/setup.js';

var loaded = false;

window.onRecaptchaLoad = function() {
  loaded = true;
};

$.fn.renderCaptcha = function() {
  var $el = this;
  if (loaded) {
    $el.removeClass('error');
    if ($el.data('opt_widget_id') !== undefined) {
      window.grecaptcha.reset($el.data('opt_widget_id'));
    } else {
      $el.data('opt_widget_id', window.grecaptcha.render($el.empty()[0], {sitekey: setup.recaptcha()}));
    }
  } else {
    $el.addClass('error').html('Waiting for reCaptcha. If this persists, please contact support.');
    setTimeout(function() {
      $el.renderCaptcha();
    }, 1000);
  }
};
