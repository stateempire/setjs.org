import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

$.fn.carousel = function (opts) {
  var index = opts.index || 0;
  var count = opts.count || opts.$items.length;
  var isActive = 'isActive' in opts ? opts.isActive : true;
  var carousel = {
    index,
    selectSlide,
    prev: function() {
      selectSlide(index - 1, true);
    },
    next: function() {
      selectSlide(index + 1, true);
    },
    change: function(_count) {
      count = _count;
    },
    setActive: function(activeState) {
      isActive = activeState;
    },
    stop: function() {
      clearTimeout(carousel.timerHandle);
    },
  };

  function setBtnState() {
    if (opts.isBounded) {
      opts.$left && opts.$left.toggleClass('disabled', index == 0);
      opts.$right && opts.$right.toggleClass('disabled', index == count - 1);
    }
  }

  function selectSlide(_index, force) {
    if ((isActive || force) && (!opts.isBounded || (_index >= 0 && _index < count))) {
      carousel.direction = _index - index;
      index = _index;
      if (index < 0) {
        index = count - 1;
      } else if (index >= count) {
        index = 0;
      }
      opts.$buttons && opts.$buttons.closest('li').removeClass('active').filter(':eq(' + (index) + ')').addClass('active');
      carousel.$current = opts.$items && opts.$items.removeClass('active').filter(':eq(' + index + ')').addClass('active');
      carousel.lastTime = Date.now();
      carousel.index = index;
      carousel.prevIndex = index == 0 ? count - 1 : index - 1;
      carousel.nextIndex = index == count - 1 ? 0 : index + 1;
      setBtnState();
      opts.select && opts.select(carousel, opts);
      clearTimeout(carousel.timerHandle);
      if (opts.time > 0) {
        carousel.timerHandle = setTimeout(carousel.next, opts.time);
      }
    }
  }

  if (opts.$buttons) {
    opts.$buttons.click(function() {
      selectSlide($(this).closest('li').index());
      return false;
    });
  }

  if (opts.$left) {
    opts.$left.click(function() {
      !opts.$left.hasClass('disabled') && selectSlide(index - 1);
      return false;
    });
  }

  if (opts.$right) {
    opts.$right.click(function() {
      !opts.$right.hasClass('disabled') && selectSlide(index + 1);
      return false;
    });
  }

  this.swipe && this.swipe({
    move: function(x, y) {
      opts.move && opts.move(carousel, x, y);
    },
    swipe: function(changeX) {
      if (changeX) {
        selectSlide(index + changeX);
      }
    },
  });

  if (opts.time > 0) {
    carousel.timerHandle = setTimeout(carousel.next, opts.time);
  }

  setTimeout(function() {
    opts.created && opts.created(carousel);
    selectSlide(index, true);
  });

  if (!opts.keep) {
    eventManager.addListener(eventTypes.unload, 'carousel', function() {
      clearTimeout(carousel.timerHandle);
    });
  }
  return this.data('carousel', carousel);
};
