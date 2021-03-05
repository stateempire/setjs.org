$.fn.slideCarousel = function() {
  var $el = this;
  var $slides = $el.find('.slides');
  $slides.carousel({
    $buttons: $el.find('.dots a'),
    $items: $slides.find('.slide'),
    isBounded: true,
    move: function(carousel, x) {
      $slides.css('left', carousel.index * -$el.find('.slides-container').width() + x);
    },
    select: function(carousel){
      $slides.animate({'left': carousel.index * -100 + 'vw'});
    }
  });
};
