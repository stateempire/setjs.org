var local = {name: 'local', mode: 'development', devtool: 'source-map'};
var development = {name: 'development', mode: 'development'};
var staging = {name: 'staging', mode: 'production'};
var production = {name: 'master', mode: 'production'};

var env = {
  local: local,
  localhost: local,
  development: development,
  testing: development,
  staging: staging,
  production: production,
  master: production,
  current: local
};

for (var i = 0; i < process.argv.length; i++) {
  var matched = process.argv[i].match(/^--env=([^ ]+)/);
  if (matched && env[matched[1]]) {
    env.current = env[matched[1]];
    break;
  }
}

module.exports = env;
