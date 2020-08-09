var setup = {
  templateUrls: function(urls) {
    return urls.map(x => '/templates/' + x + '.html?t=' + setup.timestamp());
  },
  init: function(obj) {
    $.each(obj, function(key, value) {
      if (setup[key]) {
        throw 'Duplicate key: ' + key;
      }
      setup[key] = function() {
        return value;
      };
    });
  },
};

export default setup;
