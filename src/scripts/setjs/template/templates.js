import {fatal} from 'setjs/kernel/basics.js';
import {funcWithSelf} from 'setjs/utility/comp-helpers.js';

var templates = {};
var doneUrls = {};
var tId = 1;

export function ensureTemplates({urls = [], success, error}) {
  var done = 0;
  urls = urls.filter(url => !doneUrls[url]);
  if (!urls.length) {
    success();
  }
  urls.forEach(function(url) {
    $.get(url)
      .done(function(templateStr) {
        loadTemplates(templateStr);
        doneUrls[url] = true;
        if (++done == urls.length) {
          success();
        }
      })
      .fail(error);
  });
}

function extractListHtml($list) {
  var listHtml = $list.html();
  var config = $list.data('list');
  let tName = config.t;
  if (!tName) {
    tName = 't_' + tId++;
    if ($list.children().length != 1) {
      fatal('data-list must have one child', config);
    }
    templates[tName] = listHtml;
  }
  $list.attr('data-tname', tName).empty();
}

function processList($parent) {
  var selector = '[data-list]';
  var $childLists = $parent.find(selector);
  var tree = [];
  if ($childLists.length) {
    $childLists.each(function(index, el) {
      var $el = $(el);
      var depth = $el.parents(selector).length;
      tree[depth] = tree[depth] || [];
      tree[depth].push($el);
    });
    tree.reverse().forEach(function(branch) {
      branch.forEach(extractListHtml);
    });
  }
  $parent = $parent.filter(selector);
  $parent.length && extractListHtml($parent);
}

export function loadTemplates(templateStr) {
  var $html = $(templateStr);
  funcWithSelf($html, 'template', function($item, name) {
    if (templates[name]) {
      fatal('Template exists', name);
    }
    processList($item);
    templates[name] = $item[0].outerHTML;
  });
}

export function getTemplate(templateName, alt) {
  if (templates[templateName] || alt) {
    return templates[templateName] || alt;
  } else {
    fatal('No such template', templateName);
  }
}
