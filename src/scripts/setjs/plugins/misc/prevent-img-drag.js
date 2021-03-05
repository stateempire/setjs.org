$(document).on('mousedown', function(e) {
  if (/img/i.test(e.target.tagName)) {
    e.preventDefault();
  }
});
