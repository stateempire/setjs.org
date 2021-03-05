import {fatal} from 'setjs/kernel/basics.js';
import setjs from 'setjs/kernel/setjs.js';
import {applyBindings, processIf, applyWatch, cleanupWatch} from 'setjs/template/binding.js';
import {bindEvents} from 'setjs/template/events.js';
import {storeItemByName, findWithSelf, funcWithSelf} from 'setjs/utility/comp-helpers.js';
import {configData, getConfigTemplate, tmpStr} from 'setjs/template/template-config.js';
import {getTemplate} from 'setjs/template/templates.js';

function processSlot($item, comp, data, slotConfig, forceReplace) {
  let slotComp = createComponent(getConfigTemplate('slot', slotConfig), configData(slotConfig, data) || data, comp.actions, comp);
  slotComp.$root.data('slotConfig', slotConfig);
  slotConfig.name && storeItemByName(comp, slotConfig.name || $item.data('name'), slotComp);
  if (slotConfig.replace || forceReplace) {
    $item.replaceWith(slotComp.$root);
  } else {
    $item.append(slotComp.$root);
  }
}

function renderList(comp, data, listData) {
  var config = listData.c;
  var oldList = listData.list;
  var index = 0;
  var list = listData.list = [];
  var rd = comp.rComp && comp.rComp.data || data;
  listData.$el.empty();
  $.each(configData(config, data), function(key, val) {
    var itemData = {
      [listData.d]: index,
      [listData.i]: ++index,
      [listData.k]: key,
      [listData.v]: val,
      c: config,
      pd: data,
      rd: rd,
    };
    var itemComp = createComponent(listData.t, itemData, comp.actions, comp);
    listData.$el.append(itemComp.$root);
    list.push(itemComp);
  });
  if (!list.length && (config.alt || config.sub)) {
    listData.$el.append(createComponent(getTemplate(config.alt, config.sub), $.extend({rd, pd: data}, listData), comp.actions, comp).$root);
  }
  listData.$elements = listData.$el.children();
  oldList && oldList.forEach(comp => {
    cleanupWatch(comp.data);
  });
}

function createList($el, comp, data) {
  var config = $el.data('list');
  var template = getConfigTemplate('list', config, $el.data('tname'));
  var listData = $.extend({$el, c: config, t: template, i: 'index', k: 'key', v: 'val', d: 'dex'}, config.vars);
  var name = $el.data('name');
  if (name) {
    storeItemByName(comp, name, listData);
  }
  renderList(comp, data, listData);
}

/**
 * Builds a template
 * @param {Object} templateStr - The template html string
 * @param {Object} pComp - The parent component (if any)
 * @param {Object} data - component data
 * @param {Object} actions - event handlers
 * @return {Object} returns the compiled template
 */
function createComponent(templateStr, data, actions, pComp) {
  var $root, $watchElements, $bindingElements, $actElements, $listElements, comp;
  data = data || {};
  actions = actions || {};
  $root = $(tmpStr(templateStr, data));
  if ($root.data('if')) {
    fatal('data-if at root', templateStr);
  }
  comp = {
    $root,
    data,
    actions,
    rComp: pComp && pComp.rComp || pComp,
    pComp,
    update: function($selection) {
      if (!($selection && $selection.jquery)) {
        $selection = $bindingElements;
      }
      $selection.each(function(i, el) {
        applyBindings($(el), comp, data);
      });
      setjs.compUpdate($selection);
    },
    renderSlot: function(name) {
      let slotComp = comp[name];
      if (slotComp) {
        delete comp[name];
        processSlot(slotComp.$root, comp, data, slotComp.$root.data('slotConfig'), 1);
        setjs.compUpdate(comp[name].$root);
      }
    },
    renderList: function() {
      $.each(arguments, function(i, name) {
        if (comp[name]) {
          renderList(comp, data, comp[name]);
          setjs.compUpdate(comp[name].$el);
        }
      });
  }};
  funcWithSelf($root, 'if', function($item, dataIf) {
    processIf($item, comp, data, dataIf);
  });
  funcWithSelf($root, 'src', function($item, src) {
    $item.attr('src', src);
  });
  funcWithSelf($root, 'val', function($item, val) {
    $item.attr('value', val);
  });
  $watchElements = findWithSelf($root, 'watch');
  $bindingElements = findWithSelf($root, 'bind');
  $actElements = findWithSelf($root, 'act');
  $listElements = findWithSelf($root, 'list');
  funcWithSelf($root, 'name', function($item, name) {
    name = '$' + name;
    if (comp[name]) {
      fatal('Repeat name', name);
    }
    comp[name] = $item;
  });
  // You cannot call funcWithSelf() after this, as this might add items which can affect the selection
  funcWithSelf($root, 'slot', function($item, slotConfig) {
    processSlot($item, comp, data, slotConfig);
  });
  $listElements.each(function(i, item) {
    createList($(item), comp, data);
  });
  $watchElements.each(function(i, item) {
    applyWatch($(item), comp, data);
  });
  $bindingElements.each(function(i, item) {
    applyBindings($(item), comp, data);
  });
  $actElements.each(function(i, item) {
    bindEvents($(item), comp, data, actions);
  });
  $root.data('comp', comp);
  !pComp && setjs.compUpdate(comp.$root);
  return comp;
}

export default function(templateName, data, actions, pComp) {
  return createComponent(getTemplate(templateName), data, actions, pComp);
}
