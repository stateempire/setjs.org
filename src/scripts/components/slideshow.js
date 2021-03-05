import getComp from 'setjs/template/component.js';
import {spinIndex} from 'setjs/utility/array.js';
import eventManager, {eventTypes} from 'setjs/kernel/event-manager.js';

var opened;

function setTransform() {
  if (opened) {
    setTimeout(function() {
      opened.$el.css('transform', `translate(-${opened.index * opened.$el.width()}px,0)`);
    });
  }
}

eventManager.addListener(eventTypes.resize, 'slideshow', setTransform);
eventManager.addListener(eventTypes.loadStart, 'slideshow', function() {
  opened = 0;
});

export default function(list, index) {
  var tiles = getTiles(index);
  var slideComp = getComp('common/slideshow', {
    tiles,
    loadTile: function(tile, {$el}) {
      var tileComp = getComp('common/media', tile);
      if (tileComp.$vimeo) {
        tileComp.$vimeo.attr('src', tileComp.$vimeo.data('url'));
      }
      $el.empty().append(tileComp.$root.children());
    },
  });
  var $slides = slideComp.$root.find('.slide');
  slideComp.$root.lightbox({
    close: function() {
      opened = 0;
    },
    carousel: {
      index,
      count: list.length,
      noBtns: list.length < 2,
      move: function(carousel, x) {
        slideComp.$carousel.css('transform', `translate(-${carousel.index * slideComp.$carousel.width() - x}px,0)`);
      },
      select: function(carousel) {
        var selected = selectedIndexes(carousel.index);
        $slides.removeClass('active is-previous is-next');
        $slides.eq(carousel.index).addClass('active');
        $slides.eq(carousel.prevIndex).addClass('is-previous');
        $slides.eq(carousel.nextIndex).addClass('is-next');
        // setRoute(tiles[carousel.index].link, 1);
        slideComp.carousel.list.forEach(function(tileComp, i){
          var tile = tileComp.data.tile;
          var ready = selected.indexOf(i) >= 0;
          if (tile.ready != ready) {
            tile.ready = ready;
            tileComp.update();
          }
        });
        opened = {index: carousel.index, $el: slideComp.$carousel};
        setTransform();
      }
    }
  });

  function getTiles(index) {
    var tiles = [];
    var selected = selectedIndexes(index);
    list.forEach(function(asset, i) {
      tiles.push($.extend({
        width: 1600,
        ready: selected.indexOf(i) >= 0,
      }, asset));
    });
    return tiles;
  }

  function selectedIndexes(index) {
    var selected = [];
    var count = 3;
    index = spinIndex(list, -Math.floor(count / 2), index);
    for (var i = 0; i < count; i++) {
      selected.push(index++);
      if (index == list.length) {
        index = 0;
      }
    }
    return selected;
  }
}
