export function isIE11(ua = navigator.userAgent) {
  return Boolean(ua.match(/Trident/) && ua.match(/rv[ :]11/));
}
