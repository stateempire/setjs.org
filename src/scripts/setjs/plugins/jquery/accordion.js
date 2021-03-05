$.fn.accordion = function(opts) {
  var $accordion = this;
  var aimationTime = 500;
  opts = typeof opts == 'object' ? opts : {};
  aimationTime = opts.time > 0 ? opts.time : aimationTime;
  $accordion.find('.accordion-item').each(function() {
    var $item = $(this);
    if (!$item.data('accord')) {
      $item.data('accord', 1).find('.details').css({height: 0});
      $item.find('.title').on('click', function() {
        toggle($item);
      });
    }
  });
  if (opts.index) {
    let $open = $accordion.find('.accordion-item:nth-child(' + opts.index + ')');
    if ($open.length) {
      open($open);
    }
  }
  return $accordion.data('accordion', {toggle});

  function toggle($item) {
    $item = $item || $accordion.find('.accordion-item.open');
    if ($item.length) {
      if ($item.hasClass('open')) {
        $item.removeClass('open').find('.details').animate({height: 0}, aimationTime);
        opts.close && opts.close($item);
      } else {
        open($item);
      }
    }
  }

  function open($item) {
    var $inner = $item.find('.inner');
    var $prev = $item.siblings('.open');
    var innerHeight =  $inner.outerHeight();
    var $summary = $accordion.closest('summary');
    var $details = $item.find('.details');
    if (innerHeight) {
      if (!opts.multiple) {
        $prev.removeClass('open');
        if ($prev.length && $prev.index() < $item.index()) {
          let scrollTop = $summary.scrollTop();
          $summary.animate({
            scrollTop: scrollTop - $prev.find('.details').height(),
          }, aimationTime);
        }
        $prev.removeClass('open').find('.details').animate({height: 0}, aimationTime);
      }
      $item.addClass('open');
      $details.animate({height: innerHeight}, aimationTime, function() {
        $details.css('height', 'auto');
      });
      opts.open && opts.open($item, $item.index());
    } else {
      setTimeout(open, 250, $item);
    }
  }
};
