$.fn.forceNumber = function() {
  var $el = this;
  if (!$el.data('forceInit')) {
    $el.data('forceInit', 1);
    var lastVal = $el.val();
    $el.on('input.force', function() {
      var numStr = $el.val();
      var number = parseFloat(numStr);
      if (number) {
        if (Math.floor(number) == number) {
          number += numStr.indexOf('.') >= 0 ? '.' : '';
        }
      } else if (numStr) {
        number = lastVal;
      }
      if (isNaN(number)) {
        number = '';
      }
      lastVal = number;
      $el.val(number);
    });
  }
  return $el;
};
