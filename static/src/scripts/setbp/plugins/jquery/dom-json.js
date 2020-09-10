$.fn.domJson = function(data, resets) {
  var $el = this;
  var $marker = $('<div>').insertAfter($el);
  var $form = $('<form>').append($el);
  data = data || {};
  $form.formJson(data, resets);
  $marker.after($el).remove();
  return data;
};
