var dloc = document.location;
var baseRouteHandler;

function processRoute() {
  baseRouteHandler(getPath());
}

function getPath() {
  return dloc.hash.replace(/^#(\/)?/, '');
}

export default {
  getPath,
  prefix: '/#/',
  fire: function(route) {
    dloc.hash = route;
  },
  init: function(routeHandler) {
    baseRouteHandler = routeHandler;
    window.onhashchange = processRoute;
    processRoute();
  }
};
