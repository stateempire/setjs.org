$.fn.slider = function({startX}) {
  var $slider = this;
  var isMoving;
  var last = $slider.find('.slide:last-child')[0];
  $slider.css('cursor', 'grab');
  $slider.css('transform', `translate3d(${startX}px, 0, 0)`).swipe({
    move: function(diffX) {
      isMoving = 0;
      $slider.css('transform', `translate3d(${startX + diffX}px, 0, 0)`);
      $slider.css('cursor', 'grabbing');
    },
    swipe,
  });

  function swipe({movedX, diffX, speed}) {
    var parentBounds = $slider.parent()[0].getBoundingClientRect();
    startX += diffX;
    isMoving = 1;
    move();

    function move() {
      if (isMoving && speed > 0.1) {
        diffX = speed * movedX * -17;
        $slider.css('transform', `translate3d(${startX + diffX}px, 0, 0)`);
        startX += diffX;
        speed *= Math.abs(getDiff()) <= 0 ? 0.85 : 0.5;
        requestAnimationFrame(move);
      } else {
        fixDisplacement();
      }
    }

    function getDiff() {
      let right = last.getBoundingClientRect().right;
      return (startX > parentBounds.left ? -startX : parentBounds.right > right ? parentBounds.right - right: 0);
    }

    function fixDisplacement() {
      var diff = getDiff();
      stop(startX, diff, 1, Math.ceil(3 * Math.log2(Math.abs(diff))));
    }

    function stop(start, diff, at, steps) {
      startX = start + easeOutExpo(at / steps) * diff;
      $slider.css('transform', `translate3d(${startX}px, 0, 0)`);
      $slider.css('cursor', 'grab');
      if (at < steps) {
        requestAnimationFrame(function() {
          stop(start, diff, at + 1, steps);
        });
      }
    }

    function easeOutExpo(x) {
      return x == 1 ? 1 : 1 - Math.pow(2, -5 * x);
    }
  }

  return $slider.data('slider', {
    move: function(movedX) {
      swipe({movedX, diffX: 0, speed: last.getBoundingClientRect().width / 100});
    },
  });
};
