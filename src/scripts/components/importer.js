import getComp from 'setjs/template/component.js';
import {storeValue} from 'setjs/utility/objects.js';
import {match, readCsv} from 'helpers/csv-import.js';

export default function(opts) {
  var $el = opts.$el;
  let $parent = $el.parent().addClass('loading');
  readCsv(opts.$el, function(data) {
    var header = data.shift();
    var rows = data.filter(x => x.length == header.length);
    processContents({header, rows, props: opts.props, done: opts.done, lightbox: opts.lightbox});
    $parent.removeClass('loading');
  });
}

export function processContents({header, rows, props, done, attr_importer, lightbox}) {
  var importerComp = getComp('common/importer', {
    props,
    header,
    rows,
    attr_importer,
    updateSelectCls: function(val, {$el}) {
      setTimeout(function() {
        $el.toggleClass('missing', $el.val() < 0);
      });
    },
  }, {
    selectChange: function({comp}) {
      processValidity(getColumnData());
      comp.update();
    },
    import: function() {
      var result = [];
      var indexes = [];
      var columnData = getColumnData();
      if (processValidity(columnData)) {
        var columns = columnData.columns;
        rows.forEach(function(row) {
          var obj = {};
          for (var i = 0; i < columns.length; i++) {
            let colIndex = columns[i].index;
            if (colIndex >= 0) {
              storeValue(obj, props[colIndex].prop || props[colIndex].name,row[i]);
              indexes.push(i);
            }
          }
          result.push(obj);
        });
        if (!lightbox) {
          importerComp.$root.data('lightbox').close();
        }
        done(result, indexes);
      }
    },
  });
  importerComp.header.list.forEach(function(headerItem) {
    headerItem.$props.prepend('<option selected value="-1">Unmatched</option>');
    if (attr_importer) {
      headerItem.$props.prepend('<option selected value="-2">Ignore</option>');
    }
    props.forEach(function(prop, i) {
      if (match(headerItem.data.col, prop.name)) {
        headerItem.$props.val(i);
      }
    });
  });
  processValidity(getColumnData());
  if (lightbox) {
    lightbox.replaceContent(importerComp.$root);
  } else {
    importerComp.$root.lightbox();
  }

  function processValidity({valid, duplicates, missing, columns}) {
    var msg = '';
    if (!valid) {
      if (missing.length) {
        msg += 'Missing values: ' + missing.join(', ') + '<br>';
      }
      if (duplicates.length) {
        msg += 'Duplicate values: ' + duplicates.join(', ');
      }
    } else if (attr_importer) {
      let unmatched = columns.filter(x => x.index == -1).length;
      if (unmatched) {
        msg += 'You have ' + unmatched + ' unmatched values.';
        valid = false;
      }
    }
    importerComp.data.msg = msg;
    importerComp.update();
    return valid;
  }

  function getColumnData() {
    var headerItems = importerComp.header.list;
    var columns = [];
    var duplicates = [];
    var missing = [];
    for (var i = 0; i < headerItems.length; i++) {
      let headerItem = headerItems[i];
      let index = headerItem.$props.val();
      if (index >= 0 && columns.filter(x => x.index == index).length > 0) {
        duplicates.push(props[index].name);
      }
      columns.push({index, val: props[index]});
    }
    props.forEach(function(prop, i) {
      if (prop.required && columns.filter(x => x.index == i).length < 1) {
        missing.push(prop.name);
      }
    });
    return {columns, duplicates, missing, valid: !duplicates.length && !missing.length};
  }
}
