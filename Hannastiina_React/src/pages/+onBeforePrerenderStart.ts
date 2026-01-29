export { onBeforePrerenderStart }

function onBeforePrerenderStart() {
  // Public homepage only (app is largely data-driven + auth-dependent).
  return ['/']
}
