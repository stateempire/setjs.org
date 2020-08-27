export function scrollPage(comp, target) {
  $('html, body').animate({scrollTop: target ? comp.$root.find(`[data-url="${target}"]`).offset().top : 0});
}
