var handlers = {};

$(document).on('keydown', function (e) {
  if (e.keyCode === 27) {
    $.each(handlers, function(index, handler) {
      handler();
    });
  }
});

export function addEscapeHandler(key, handler) {
  handlers[key] = handler;
}

export function removeEscapeHandler(key) {
  delete handlers[key];
}
