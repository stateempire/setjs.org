$.fn.fileUpload = function (options) {
  var $file = $(`<input type="file" name="file" accept="${options.accept || 'image/*'}"/>`);
  var $input = $('<label></label>').append($file);
  var $form = $(`<form encType="multipart/form-data" class="${options.formCls || 'file-form'}"></form>`).append($input);
  var fileInput = $file[0];
  var form = $form[0];

  $file.on('change', function () {
    var file = fileInput.files && fileInput.files[0];
    if (file) {
      options.fileChange(form, new FormData(), file);
    }
  });
  return this.append($form);
};
