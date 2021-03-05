import getComp from 'setjs/template/component.js';
import {addFuncs} from 'core/acts-funcs.js';
import getCloudinaryOpts from 'config/cloudinary-config.js';
import {setPending} from 'core/route-manager.js';
import {imgCloud, vidCloud} from 'helpers/misc.js';
export {setPending};

addFuncs({
  assetThumb: function(asset, {$el}, width = 500) {
    var src = asset.path.slice(0, 1 - (asset.path.length - asset.path.lastIndexOf('.'))) + 'jpg';
    $el.attr('src', (asset.source == 'video' ? vidCloud() : imgCloud()) + `w_${width},fl_lossy,f_auto/` + src);
    // return path.replace(/.pdf$/, '.jpg');
  },
});

function changeState($btn, disabled /*, msg, msgCls = 'success'*/) {
  // notification(msg, msgCls, disabled);
  $btn && $btn.prop('disabled', disabled).toggleClass('disabled', disabled);
}

export default function(opts) {
  var {$el, rootComp, list, pdf, updateFunc} = opts;
  var $submitBtn = rootComp.$root.find('button[type="submit"]');
  var limit = $el.data('limit') || opts.limit || 1;
  var resourceType = $el.data('uploadType') || opts.uploadType || 'auto'; // auto, image, video, raw. https://cloudinary.com/documentation/upload_widget
  var widgetOpts = getCloudinaryOpts({
    resourceType,
    maxFileSize: $el.data('maxSize') || opts.maxSize || '10000000', // default to 10MB,
    folder: (opts.folder || (pdf ? 'documents' : 'assets')),
    clientAllowedFormats: pdf ? ['pdf'] : resourceType == 'image' ? ['png', 'gif', 'jpeg', 'jpg', 'svg'] : null,
  });

  var compData = {
    list,
    maxFiles: limit - list.length,
  };
  var uploadComp = getComp('common/uploader', compData, {
    open: function() {
      if (uploadComp.open || compData.maxFiles < 1) {
        return;
      }
      widgetOpts.maxFiles = compData.maxFiles;
      widgetOpts.multiple = compData.maxFiles > 1;
      uploadComp.open = 1;
      changeState($submitBtn, true);
      cloudinary.openUploadWidget(widgetOpts,
        (error, result) => {
          if (!error && result) {
            if (result.event == 'success') {
              compData.maxFiles--;
              list.push(createAsset(result.info));
              uploadComp.renderList('list');
              uploadComp.update();
              setPending('You have uploaded image(s) and/or file(s), but not saved your data. To save, click Stay and then Save.');
              updateFunc && updateFunc();
            } else if (result.event == 'display-changed' && result.info == 'hidden') {
              changeState($submitBtn, false);
              uploadComp.open = 0;
              setTimeout(function() {
                $('iframe').remove();
              }, 1000);
            }
          }
        }
      );
    },
    remove: function({data}) {
      compData.maxFiles++;
      list.splice(data.key, 1);
      uploadComp.renderList('list');
      uploadComp.update();
      updateFunc && updateFunc();
    },
    move: function({data, arg}) {
      var newIndex = data.dex + arg;
      if (newIndex > -1 && newIndex < list.length) {
        list.splice(data.dex, 1);
        list.splice(newIndex, 0, data.item);
        uploadComp.renderList('list');
      }
    },
  });
  $el.replaceWith(uploadComp.$root);
}

export function createAsset(asset) {
  var source = asset.resource_type;
  if (['gif', 'pdf'].indexOf(asset.format) >= 0) {
    source = asset.format;
  }
  return {
    source,
    format: asset.format,
    uuid: asset.asset_id,
    path: asset.path,
    file_name: asset.original_filename,
    service: 'cloudinary',
    width: asset.width,
    height: asset.height,
    public_id: asset.public_id,
    bytes: asset.bytes,
    colors: Array.isArray(asset.colors) ? asset.colors.slice(0, 5) : [],
    predominant: {google: asset.predominant && asset.predominant.google},
  };
}
