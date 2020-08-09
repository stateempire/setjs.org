import setjs from '@stateempire/setjs';

var pages = {};

function createComp({route}) {
  return setjs.getComp(route.path);
}

function createCompFunc(template) {
  return function() {
    return setjs.getComp(template);
  };
}

function createPage(template, folder) {
  template = folder ? folder + '/' + template : template;
  return {
    templates: [template],
    getComp: folder ? createCompFunc(template) : createComp
  };
}

export function addPaths(folder, paths) {
  if (!paths) {
    paths = folder;
    folder = 0;
  }
  paths.forEach(function(path) {
    addPage(path, createPage(path, folder));
  });
}

export function addPath(path, template, folder) {
  addPage(path, createPage(template, folder));
}

export function addPage(path, page) {
  if (pages[path]) {
    throw 'Path already exists: ' + path;
  }
  page.preload = 'preload' in page ? page.preload : dummyPageFunc;
  page.once = 'once' in page ? page.once : dummyPageFunc;
  page.path = path;
  pages[path] = page;
}

export function getPage(path) {
  var page;
  $.each(pages, function(pattern, value) {
    if (RegExp('^' + pattern + '$').test(path)) {
      page = value;
      return false;
    }
  });
  return page;
}

export function dummyPageFunc({success}) {
  success();
}

export function addPrefixedPaths(prefix, paths) {
  addPaths(paths.map(path => prefix + '/' + path));
}

export function addFolderPages(folder, names) {
  names.forEach(function(name) {
    addPage(folder + '/' + name, {
      templates: [folder],
      getComp: function() {
        return setjs.getComp(folder + '/' + name);
      },
    });
  });
}
