// Loaded in <head> on purpose. Applies saved theme/motion choices before the
// first paint, and flags that JS is running so enhanced styles can kick in.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var theme = null, motion = null;
  try {
    theme = localStorage.getItem('nm-theme');
    motion = localStorage.getItem('nm-motion');
  } catch (e) { /* storage blocked - fall back to OS settings */ }

  if (!theme && window.matchMedia) {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (!motion && window.matchMedia) {
    motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
  }

  root.setAttribute('data-theme', theme || 'light');
  root.setAttribute('data-motion', motion || 'full');
})();
