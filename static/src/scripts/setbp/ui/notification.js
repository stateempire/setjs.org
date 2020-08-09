var $notification = $('#notification');

export default function notification(msgObj, cls, sticky) {
  $notification.text(msgObj.message || msgObj).addClass('active').addClass(cls);
  if (!sticky) {
    setTimeout(function() {
      $notification.removeClass('active');
      setTimeout(function() {
        $notification.removeClass(cls);
      }, 400);
    }, 4000);
  }
}

export function errorNotification(callback) {
  return function (msgObj) {
    notification(msgObj, 'error');
    callback && callback(msgObj);
  };
}

export function successNotification(callback) {
  return function (msgObj) {
    notification(msgObj, 'success');
    callback && callback(msgObj);
  };
}
