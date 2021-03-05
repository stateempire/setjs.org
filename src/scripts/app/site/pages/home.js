import getComp from 'setjs/template/component.js';
import todo from 'app/site/examples/todo.js';

export default {
  templates: ['site/home'],
  preload: function({success, error}) {
    $.get('/templates/todo.html', function(todoTxt) {
      success(todoTxt);
   }, 'text').fail(error);
  },
  comp: function(opts, todoHtml) {
    var pageComp = getComp('site/home');
    pageComp.$todo.append(todo.comp().$root);
    pageComp.$todoHtml[0].innerText = todoHtml;
    return pageComp;
  }
};
