import router from 'Router';

var setjs = {};
var currentRoute = {};
var oldRoute, skipRout;

function makeRoute(path) {
  var i, route;
  var parts = path.split('/');
  var lang = setjs.lang() && parts.splice(0, 1)[0];
  route = {
    lang,
    path: parts.join('/'),
    pageId: parts[0] || '',
    slug: parts[1],
    id: parts[2],
  };
  for (i = 3; i < parts.length; i++) {
    route['id' + (i - 1)] = parts[i];
  }
  return route;
}

function baseRouteHandler(path) {
  let newRoute = makeRoute(path);
  let fixedPath = setjs.fixPath(path);
  let lang = setjs.lang();
  if (path != fixedPath) {
    setRoute(newRoute.path);
  } else if (!lang || lang == newRoute.lang) {
    oldRoute = currentRoute;
    currentRoute = newRoute;
    if (!skipRout) {
      setjs.handleRoute(currentRoute);
    }
    skipRout = 0;
  } else {
    setRoute(path);
  }
}

export function setRoute(newRoute, _skipRout) {
  skipRout = _skipRout;
  router.fire(setjs.getLink(newRoute));
}

export function prevRoute() {
  return oldRoute;
}

export function getRoute() {
  return currentRoute;
}

export function reloadPage() {
  setjs.handleRoute(currentRoute);
}

export function initSetjs(setjsExt) {
  $.extend(setjs, setjsExt);
}

export function startApp() {
  router.init(baseRouteHandler);
}

export default setjs;
