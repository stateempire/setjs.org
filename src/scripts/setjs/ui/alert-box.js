import getComp from 'setjs/template/component.js';

export default function(opts) {
  let isBusy = 0;
  let exOpts = $.extend({noBtn: opts.noTxt, noClose: 1}, opts);
  let alertComp = getComp('common/alert-box', exOpts, {
    no: function() {
      if (isBusy) return;
      lightbox.destroy();
      opts.no && opts.no(controller, alertComp);
    },
    ok: function() {
      if (isBusy) return;
      if (opts.ok) {
        isBusy = 1;
        alertComp.$root.addClass('loading');
        opts.ok(controller, alertComp);
      } else {
        lightbox.destroy();
      }
    },
  });
  let lightbox = alertComp.$root.lightbox(exOpts).data('lightbox');
  var controller = {
    error: function(error) {
      exOpts.errorMsg = error.message || error;
      alertComp.$root.removeClass('loading');
      alertComp.update();
      isBusy = 0;
    },
    close: function(stopLoading) {
      lightbox.destroy();
      if (stopLoading) {
        $('body').removeClass('loading');
      }
    }
  };
  return controller;
}
