import getComp from 'setjs/template/component.js';

export function assetTile(asset) {
  if (asset.source == 'vimeo' || asset.source == 'youtube') {
    return plyrVideo($.extend({
      videoUrl: 'https://' + (asset.source == 'vimeo' ? 'player.vimeo.com/video/' : 'www.youtube.com/embed/') + asset.embed_id
    }, asset));
  } else {
    return getComp('common/media/thumbnail', asset).$root;
    // return getComp('common/media/cloudinary', asset).$root;
  }
}

export function plyrVideo(vid) {
  var params = (vid.play ? '&autoplay=1' : '') + (vid.loop ? '&loop=1' : '');
  var comp = getComp('common/plyr-video', {vid, params});
  setTimeout(function() {
    new Plyr(comp.$video[0], {
      controls: ['play', 'play-large', 'volume', 'mute', 'progress'],
      fullscreen: { enabled: false, fallback: true, iosNative: false },
      keyboard: { focused: false, global: false },
      clickToPlay: false,
    });
  }, 3000);
  return comp.$root;
}

export function isVideoOrGif(mime) {
  return /video|image\/gif/.test(mime);
}
