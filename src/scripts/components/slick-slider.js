var responsiveBase = [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 3,
      // slidesToScroll: 3,
      variableWidth: true,
      centerMode: true,
    }
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow: 2,
      // slidesToScroll: 2
      variableWidth: true,
      centerMode: true,
    }
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      // centerMode: true,
    }
  }
];

export default function({$el, styles = []}) {
  var responsive = [];
  responsiveBase.forEach(function(item) {
    var config = {
      breakpoint: item.breakpoint,
      settings: $.extend({}, item.settings, styles[item.breakpoint])
    };
    responsive.push(config);
  });
  $el.find('.slides').slick({
    speed: 300,
    slidesToShow: 3,
    // slidesToScroll: 4,
    prevArrow: $el.find('.left-btn'),
    nextArrow: $el.find('.right-btn'),
    responsive,
  });
}
