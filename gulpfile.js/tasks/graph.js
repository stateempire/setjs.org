var glob = require('glob');
var fs = require('fs-extra');
var files = [];

exports.graph = function(cb) {
  glob('src/scripts/**/*.js', function (err, res) {
    if (err) {
      console.log('Error', err);
    } else {
      res.forEach(filePath => {
        let data = fs.readFileSync(filePath, 'UTF-8');
        let lines = data.split(/\r?\n/);
        let relativePath = filePath.slice(filePath.indexOf('scripts') + 8);
        let fileData = {path: relativePath, imports: [], exports: []};
        files.push(fileData);
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          if (line.length) {
            if (line.indexOf('import') == 0) {
              let impPath = line.match(/['`"]([^'`"]+)['`"]/)[1];
              if (impPath[0] == '.') {
                let realPath = impPath.slice(impPath.match(/\/[^.]/).index + 1);
                let steps = impPath.slice(0, impPath.match(/\/[^.]/).index).split('/').filter(x => x.length > 1).length;
                let parts = relativePath.split('/').reverse().slice(1);
                impPath = parts.slice(steps).reverse().join('/') + '/' + realPath;
              }
              fileData.imports.push({path: impPath});
            } else if (line.indexOf('function') == 0 || line.indexOf('var') == 0) {
              break;
            }
          }
        }
      });
      let graph = files.map((x, i) => {return {index: i, path: x.path, imports: [], exports: []}; });
      files.forEach((fileData, i) => {
        let graphObj = graph[i];
        fileData.imports.forEach(imp => {
          let found = obtain(files, imp.path, 'path');
          if (found) {
            pushUnique(graphObj.imports, found.index);
            pushUnique(graph[found.index].exports, i);
          }
        });
      });
      graph = reduce(graph);
      graph.length && console.log(graph);
      console.log(graph.length + ' cyclic dependencies found');
      // fs.outputJson('../../static/src/data/graphs/graph.json', files);
      fs.outputJson('dist/data/graphs/graph.json', files);
      cb();
    }
  });
};

function obtain(list, value, prop1, prop2, prop3) {
  for (let i = 0; i < list.length; i++) {
    if (list[i][prop1] == value || (arguments.length > 3 && list[i][prop2] == value) || (arguments.length > 4 && list[i][prop3] == value)) {
      return {index: i, val: list[i]};
    }
  }
}

function pushUnique(list, val) {
  if (list.indexOf(val) < 0) {
    list.push(val);
  }
}

function reduce(graph) {
  let changed = 1;
  while (changed) {
    changed = 0;
    for (let i = 0; i < graph.length; i++) {
      if (!graph[i].del && (graph[i].imports.length == 0 || graph[i].exports.length == 0)) {
        graph = propagate(graph, i);
        changed = 1;
      }
    }
    if (!changed) {
      return graph.filter(({del}) => !del).map(x => {
        return {
          path: x.path,
          imports: x.imports.map(index => files[index].path),
          imported_by: x.exports.map(index => files[index].path),
        };
      });
    }
  }

  function propagate(graph, i) {
    change(graph, i, 'exports', 'imports');
    change(graph, i, 'imports', 'exports');
    graph[i].del = 1;
    return graph;
  }

  function change(graph, i, first, second) {
    graph[i][first].forEach(j => {
      let nb = graph[j][second];
      nb.splice(nb.findIndex(num => num == i), 1);
      if (nb.length == 0) {
        graph = propagate(graph, j);
      }
    });
  }
}
