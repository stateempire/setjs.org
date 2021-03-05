import getComp from 'setjs/template/component.js';
import {api} from 'core/api-helper.js';
import {loadImage, getFileMimeType} from 'setjs/utility/assets.js';

var states = {
  init: 1,
  url: 2,
  img: 4,
  uploading: 8,
  downloading: 16,
  uploadErr: 32,
  downloadErr: 64,
  urlFormatErr: 128,
  busy: 8 | 16,
  error: 32 | 64 | 128,
};

$.fn.s3Uploader = function({item, $saveBtn}) {
  var s3Config;
  var data = $.extend({state: item.asset_raw ? states.img : states.init, states}, item);
  var comp = getComp('common/s3-uploader', data, {
    changeState: function({arg}) {
      data.state = states[arg];
      comp.update();
    },
    saveUrl: function() {
      var url = $.trim(comp.$imgUrl.val());
      if (url) {
        data.state = states.busy;
        data.progress = 0;
        data.imgMsg = 'Downloading image...';
        comp.update();
        busyStart();
        loadImage({
          url,
          error: function() {
            data.state |= states.error;
            data.imgMsg = 'Unable to download the image. Check URL.';
            comp.update();
          },
          success: function() {
            updateImage(url);
          },
          complete: busyEnd
        });
      }
    }
  });
  busyStart();
  init();
  return this.append(comp.$root);

  function init() {
    api.getUploadPresigned({
      id: item.asset_id,
      error: function() {
        data.imgMsg = 'Image uploading not available right now. Is your internet ok?';
        data.state = states.error;
        comp.update();
      },
      success: function (response) {
        delete response.data.params.key;
        s3Config = response.data;
        comp.$imgFileWrapper.fileUpload({fileChange: processFile});
        comp.update();
      },
      complete: busyEnd,
    });
  }

  function busyStart() {
    $saveBtn.prop('disabled', true);
  }

  function busyEnd() {
    $saveBtn.prop('disabled', false);
  }

  function updateImage(url) {
    data.state = states.img;
    data.asset_raw = item.asset_raw = url;
    comp.update();
  }

  function processFile(form, formData, file) {
    if (file.size > 1.5 * 1024 * 1024) { // more than 1.5MB
      data.imgMsg = 'The file must be smaller than 1.5 MB';
      data.state = states.busy | states.error;
      comp.update();
    } else {
      getFileMimeType(file, function(type, ext) {
        uploadToS3(form, formData, file, type, ext);
      });
    }
  }

  function uploadToS3(form, formData, file, type, ext) {
    formData.append('key', `${s3Config.keyStart}asset_raw.${ext}`);
    formData.append('success_action_status', 201);
    formData.append('X-Requested-With', 'xhr');
    formData.append('Content-Type', type);
    $.each(s3Config.params, function(key, val) {
      formData.append(key, val);
    });
    formData.append('file', file);
    data.state = states.busy;
    data.imgMsg = 'Uploading image...';
    data.progress = 0;
    comp.update();
    busyStart();
    $.ajax({
      url: `https://${s3Config.region}.amazonaws.com/${s3Config.bucket}`,
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false, // 'multipart/form-data',
      xhr: function(){ // progress for upload: http://stackoverflow.com/a/20984502/1227747
        var xhr = $.ajaxSettings.xhr();
        xhr.upload.onprogress = function(e) {
          if (e.lengthComputable){
            data.progress = Math.round(e.loaded / e.total * 100);
            comp.update();
          }
        };
        return xhr;
      },
      success: function (res, textStatus, jqXHR) {
        var url = $(jqXHR.responseText).find('Location').text();
        data.imgMsg = 'Downloading image...';
        data.progress = 0;
        comp.update();
        loadImage({
          url,
          error: function() {
            data.imgMsg = 'Unable to download image, is your internet ok?';
            data.state |= states.error;
            comp.update();
          },
          success: function() {
            updateImage(url);
          }
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        data.imgMsg = (errorThrown && typeof errorThrown == 'string') ? errorThrown : 'Unable to upload image, is your internet ok?';
        data.state |= states.error;
        comp.update();
      },
      complete: function() {
        form.reset();
        busyEnd();
      }
    });
  }
};
