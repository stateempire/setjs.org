import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';
import {pointInside} from 'setjs/utility/geometry.js';

eventManager.addListener(eventTypes.init, 'hover-menu', function() {
  $(document).on('mouseenter', '.hover-dropdown-btn', function() {
    var $menu = $(this).closest('.hover-dropdown');
    $('.hover-dropdown.open').removeClass('open');
    $menu.addClass('open');
  });

  $(document).on('mouseleave', '.hover-dropdown', function(e) {
    var $menu = $(this);
    var $list = $menu.find('.hover-dropdown-list');
    var $btn = $menu.find('.hover-dropdown-btn');
    var btnOffset = $btn.offset();
    var listOffset = $list.offset();
    var btnBottom = btnOffset.top + $btn.height();
    var bounds = [
      [btnOffset.left, btnOffset.top],
      [btnOffset.left + $btn.width(), btnOffset.top],
      [btnOffset.left + $btn.width(), btnBottom],
      [listOffset.left + $list.width(), btnBottom],
      [listOffset.left + $list.width(), btnBottom + $list.height()],
      [listOffset.left, btnBottom + $list.height()],
      [listOffset.left, btnBottom],
      [btnOffset.left, btnBottom],
    ];
    if (!pointInside(e.clientX, e.clientY, bounds)) {
      $('.hover-dropdown.open').removeClass('open');
    }
  });
});
