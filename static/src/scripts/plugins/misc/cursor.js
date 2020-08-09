import {isTouchDevice} from 'setbp/utility/mobile.js';

var $cursor = $('#site-cursor');
var $items = $('#site-cursor>div');

$(function() {
  if (isTouchDevice()) {
    $cursor.remove();
    return;
  }
  $(document).on('mousemove.cursor', function(e) {
    $items.css({transform: `translate3d(${e.clientX}px, ${e.clientY}px, 0)`});
  });
  $(document).on('mouseenter', function() {
    $cursor.show();
  });
  $(document).on('mouseleave', function() {
    $cursor.hide();
  });
  $(document).on('mouseenter', 'a', function() {
    $cursor.addClass('expand');
  });
  $(document).on('mouseleave', 'a', function() {
    $cursor.removeClass('expand');
  });
  // $(document).on('mouseenter', 'figure', function() {
  //   $cursor.addClass('blend');
  // });
  // $(document).on('mouseleave', 'figure', function() {
  //   $cursor.removeClass('blend');
  // });
});
