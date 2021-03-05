import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {closeCls} from 'config/app-config.js';

eventManager.addListener(eventTypes.route, 'lightbox', function() {
  $('.lightbox').remove();
  $(document).off('keydown.lightbox');
  $('body').removeClass('lightbox-open');
});

$.fn.lightbox = function (opts = {}) {
  var mode = opts.mode || 'lightbox';
  var delay = opts.delay || (mode == 'sidebar' ? 320 : 20);
  var $lightbox = $(`<div class="${mode}"></div>`).appendTo('body');
  // var $inner = $('<div class="inner">').appendTo($lightbox);
  // var $btnParent = opts.inner ? $inner : $lightbox;
  var $btnParent = $lightbox;
  // var lightbox = {opts, $lightbox, $inner, destroy, close, replaceContent};
  var lightbox = {opts, $lightbox, destroy, close, replaceContent};
  var openCls = `${mode}-open`;
  var openingCls = openCls + 'ing';
  var closingCls = `${mode}-closing`;

  function replaceContent($content) {
    $lightbox.empty().append($content.data('lightbox', lightbox));
    addCloseBtn();
  }

  function destroy(done) {
    if (!lightbox.closed) {
      lightbox.closed = true;
      $(document).off('keydown.lightbox');
      $('body').addClass(closingCls);
      setTimeout(function(){
        $('body').removeClass(openCls).removeClass(closingCls);
        $lightbox.remove();
        done && done();
      }, delay);
    }
  }

  function close(force) {
    if (!opts.noClose || force) {
      !lightbox.closed && opts.close && opts.close();
      destroy();
    }
  }

  function initCarousel() {
    if (opts.carousel) {
      if (!opts.carousel.noBtns) {
        opts.carousel.$left = opts.carousel.$left || $('<div class="nav-left"></div>').appendTo($btnParent);
        opts.carousel.$right = opts.carousel.$right || $('<div class="nav-right"></div>').appendTo($btnParent);
      }
      lightbox.carousel = (opts.carousel.$el || $lightbox).carousel(opts.carousel).data('carousel');
    }
  }

  $(document).on('keydown.lightbox', function (e) {
    if (e.keyCode === 27) {
      close();
    } else if (lightbox.carousel && $(e.target).hasClass(openCls)) {
      if (e.keyCode === 37) {
        lightbox.carousel.prev();
      } else if (e.keyCode === 39) {
        lightbox.carousel.next();
      }
    }
  });

  $lightbox.append(this);
  initCarousel();
  !opts.noClose && addCloseBtn();
  $('body').addClass(openingCls);
  setTimeout(function(){
    $('body').addClass(openCls).removeClass(openingCls);
    opts.created && opts.created(lightbox);
  }, delay);
  return this.data('lightbox', lightbox);

  function addCloseBtn() {
    var $btn = $(`<button class="${closeCls} lightbox-close-btn"></button>`).appendTo($btnParent).add($lightbox.find('.popup-close'));
    if (!opts.noBgClose) {
      $btn = $btn.add($lightbox);
    }
    $btn.click(function(e) {
      var $target = $(e.target);
      var ownClose = $target.hasClass(mode) || ($target.hasClass('lightbox-close-btn'));
      if (ownClose || $target.closest('.popup-close').length) {
        close();
        if (ownClose) {
          return false;
        }
      }
    });
  }
};
