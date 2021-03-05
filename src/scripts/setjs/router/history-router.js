var dloc = document.location;
var baseRouteHandler;

function processRoute() {
  baseRouteHandler(getPath());
}

function getPath() {
  return dloc.pathname.replace(/^(\/)/, '');
}

export default {
  getPath,
  prefix: '/',
  fire: function(route) {
    window.history.pushState({}, document.title, route);
    processRoute();
  },
  init: function(routeHandler) {
    baseRouteHandler = routeHandler;
    window.onpopstate = processRoute;
    processRoute();
  }
};
