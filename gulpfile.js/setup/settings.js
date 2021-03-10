var fs = require('fs');
var yaml = require('js-yaml');
var env = require('./environment.js');

var settings = {
  routerName: 'history',
  timestamp: Date.now(),
};

var yamlConfig = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
var currentConfig = Object.assign(yamlConfig, yamlConfig[env.current.name]);
Object.assign(settings, currentConfig, getLocalConfig());

function getLocalConfig() {
  try {
    let local = yaml.load(fs.readFileSync('./_local.yml', 'utf8'));
    Object.assign(local, local[env.current.name]);
    console.log('_local.yml', local);
    return local;
  } catch (e) {
    console.log('_local.yml was not used.');
  }
}

module.exports = settings;
