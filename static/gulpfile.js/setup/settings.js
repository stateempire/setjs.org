var fs = require('fs');
var yaml = require('js-yaml');
var env = require('./environment.js');

var settings = {
  routerName: 'history',
  timestamp: Date.now(),
};

var yamlConfig = yaml.safeLoad(fs.readFileSync('../config.yml', 'utf8'));
var currentConfig = Object.assign(yamlConfig, yamlConfig[env.current.name]);
Object.assign(settings, currentConfig, getLocalConfig());
settings.api_url = settings.api_url || '//' + ((settings.domain + (settings.api_port ? ':' + settings.api_port: '') + settings.app_url));

function getLocalConfig() {
  try {
    let local = yaml.safeLoad(fs.readFileSync('../_local.yml', 'utf8'));
    console.log('_local.yml', local);
    return local;
  } catch (e) {
    console.log('_local.yml was not used.');
  }
}

module.exports = settings;
