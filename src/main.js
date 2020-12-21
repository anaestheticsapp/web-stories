import './components/stories-view.js';

(async function loadMaterialIcons() {
  await import('./components/svg-icon');
}());

window.addEventListener('error', (e) => console.error(e));
window.addEventListener('unhandledrejection', (e) => console.error(e.reason));
