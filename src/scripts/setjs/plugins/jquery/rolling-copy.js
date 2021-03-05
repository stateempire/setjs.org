$.fn.rollingCopy = function() {
  var handle;
  var index = 0;
  var delay = (this.data('delay') || 0.7) * 1000;
  var $items = this.find('>*');
  $items.filter(':eq(0)').addClass('in');
  handle = setInterval(function() {
    var $out = $items.filter(`:eq(${index})`).removeClass('in').addClass('out');
    index++;
    if (index >= $items.length) {
      index = 0;
    }
    $items.filter(`:eq(${index})`).addClass('in');
    setTimeout(function() {
      $out.removeClass('out');
    }, delay);
  }, (this.data('interval') || 1) * 1000);

  return this.data('rolling', {
    unload: function() {
      clearTimeout(handle);
    }
  });
};
