import getComp from 'setjs/template/component.js';

export default {
  templates: ['site/todo'],
  comp: function() {
    var todoList = ['🏠 Clean the house', '🥛 Buy milk', '🍕 Less Pizza', '🍩 More Donuts'];
    var todoComp = getComp('site/todo', {todoList}, {addItem, removeItem});
    return todoComp;

    function addItem() {
      todoList.push(todoComp.$input.val());
      todoComp.renderList('todoList');
      todoComp.$input.val('');
    }

    function removeItem({data}) {
      todoList.splice(data.key, 1);
      todoComp.renderList('todoList');
    }
  }
};
