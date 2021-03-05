import setup from 'config/setup.js';
import {batchCall} from 'setjs/utility/calls.js';
import {ensureTemplates} from 'setjs/template/templates.js';
// import {setDefData} from 'setjs/kernel/basics.js';

export default function(opts) {
  batchCall(opts)
  .add(ensureTemplates, {urls: setup.templateUrls(['common'])})
  // .add(loadData, {path: '/data/some file', name: 'def name'})
  .go();
}

// function loadData({path, name, success, error}) {
//   $.getJSON(path + '.json?t=' + setup.timestamp(), function(data) {
//     setDefData(name, data);
//     success();
//   })
//   .fail(error);
// }
