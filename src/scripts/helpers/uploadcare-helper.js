import uploadcare from 'uploadcare-widget';
// import {notification} from 'components/notification.js';

export function createUcareAsset(fileInfo) {
  var mimeType = fileInfo.mimeType || fileInfo.mime_type;
  var asset = {
    ucid: fileInfo.uuid,
    source: 'ucareimage',
  };
  if (/image\/gif/i.test(mimeType)) {
    asset.source = 'ucaregif';
  } else if (/video/i.test(mimeType)) {
    asset.source = 'ucarevideo';
  }
  return asset;
}

export function createUploader({comp, $el, done}) {
  var widget = uploadcare.SingleWidget($el[0])
  .onChange(function(file) {
    if (file) {
      comp.$root.find('[type="submit"]').prop('disabled', true).addClass('disabled');
      // notification('Uploading file...', '', 1);
      file.done(function(fileInfo) {
        comp.$root.find('[type="submit"]').prop('disabled', false).removeClass('disabled');
        widget.value(null);
        // notification('File uploaded', 'success');
        done(createUcareAsset(fileInfo));
      }).fail(function() {
        // notification('Unable to upload your file', 'error');
      });
    }
  });
  return widget;
}
