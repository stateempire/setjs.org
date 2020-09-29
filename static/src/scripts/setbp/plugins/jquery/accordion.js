$.fn.accordion = function(opts = {}) {
  var $acordion = this;
  $acordion.find('.accordion-item').each(function() {
    var $item = $(this);
    var index = $item.index();
    if (!$item.hasClass('accord-ready')) {
      $item.addClass('accord-ready');
      $item.find('.title').on('click', function() {
        if ($item.hasClass('open')) {
          $item.removeClass('open');
          opts.close && opts.close($item, index);
        } else {
          $item.siblings('.open').removeClass('open');
          $item.addClass('open');
          opts.open && opts.open($item, index);
        }
      });
    }
  });
  if (opts.open) {
    let $open = $acordion.find('.accordion-item.open').eq((opts.open || 1) - 1);
    if ($open.length) {
      opts.open($open, $open.index());
    }
  }
  return $acordion.data('accordion', {
    toggle: function(index) {
      $acordion.find('.accordion-item').removeClass('open').eq(index).addClass('open');
    },
  });
};
