import Papa from 'papaparse';
import alertBox from 'setjs/ui/alert-box.js';

export function match(val1, val2) {
  val1 = (val1 || '').toLowerCase();
  val2 = (val2 || '').toLowerCase();
  return val1 == val2 || val1.replace(/\s/g, '_') == val2.replace(/\s/g, '_');
}

export function readCsv($el, complete) {
  var file = $el[0].files && $el[0].files[0];
  if (file) {
    $el.val(null);
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: function({data}) {
        complete(data);
      },
      error: function() {
        alertBox({message: 'Unable to parse the imported CSV'});
      }
    });
  }
}
