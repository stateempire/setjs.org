$.fn.miniCarousel = function() {
  var $el = this;
  var $carousel = $el.find('.carousel');
  var slider = $carousel.data('slider');
  if (!slider) {
    slider = $carousel.slider({startX: 0}).data('slider');
    $el.find('.left-btn, .right-btn').on('click', function() {
      slider.move($(this).hasClass('left-btn') ? -1 : 1);
    });
  }
};
