$.fn.forceNumber = function(opts) {
  return this.each(function() {
    var $el = $(this);
    if (!$el.data('forceInit')) {
      var lastVal = $el.val();
      $el.data('forceInit', 1);
      $el.on('input.force', function() {
        var numStr = $el.val();
        var dot = 0;
        var valid = 1;
        var number = '';
        var cursorAt = $el[0].selectionStart -1;
        var char;
        var decimals = 0;
        for (var i = 0; valid && i < numStr.length; i++) {
          char = numStr[i];
          number += char;
          if (dot && ++decimals > opts.decimals) {
            valid = 0;
          } else if (char == '.') {
            valid = opts.int ? 0 : !dot;
            dot = 1;
          } else {
            valid = (i == 0 && ((!opts.noplus && char == '+') || (!opts.nominus && char == '-'))) || /[0-9]/.test(char);
          }
        }
        lastVal = valid ? number : lastVal;
        $el.val(lastVal);
        if (!valid) {
          $el[0].selectionStart = cursorAt;
          $el[0].selectionEnd = cursorAt;
        }
      });
    }
  });
};
