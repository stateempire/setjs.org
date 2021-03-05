import {addFuncs} from 'core/acts-funcs.js';

addFuncs({
  lazyVimeo: function(vidData, {$el, comp}) {
    var options = {
      id: vidData.video_id,
      autoplay: 1,
      controls: 0,
      loop: 1,
      muted: 1,
      quality: '720p',
      playsinline: 1,
      background: 1
    };
    var player = new Vimeo.Player($el, options);
    comp.$playBtn.on('click', function() {
      player.setCurrentTime(0);
      player.setVolume(1);
      comp.$playBtn.hide();
    });
  }
});
