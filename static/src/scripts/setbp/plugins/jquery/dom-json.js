$.fn.domJson = function(data = {}) {
  var $el = this;
  var $marker = $('<div>').insertAfter($el);
  var $form = $('<form>').append($el);
  $form.formJson(data);
  $marker.after($el).remove();
  return data;
};
