$.fn.accordion = function(opts = {}) {
  this.find('.accordion-item').each(function(index) {
    var $item = $(this);
    $item.find('.title').off('click').on('click', function() {
      if ($item.hasClass('open')) {
        $item.removeClass('open');
        opts.close && opts.close($item, index);
      } else {
        $item.siblings('.open').removeClass('open');
        $item.addClass('open');
        opts.open && opts.open($item, index);
      }
    });
  });
  if (opts.open) {
    let $open = this.find('.accordion-item.open').eq(0);
    if ($open.length) {
      opts.open($open, $open.index());
    }
  }
  return this;
};
