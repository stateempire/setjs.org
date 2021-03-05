export default function(opts) {
  return $.extend({
    closeAfterSelect: true,
    plugins: ['remove_button'],
  }, opts);
}
