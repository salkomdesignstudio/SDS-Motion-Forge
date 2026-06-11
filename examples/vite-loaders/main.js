// THE ONLY STYLE IMPORT: the standalone loaders category bundle.
import '@salkomdesignstudio/sds-motion-forge/categories/loaders';

// The registry is the single source of truth (R3) — the loader list is not
// hand-maintained here.
import registry from '@salkomdesignstudio/sds-motion-forge/registry/motion.registry.json';

const loaders = registry.classes.filter((c) => c.category === 'loaders');
document.getElementById('meta').textContent =
  `${loaders.length} loader classes rendered from registry v${registry.version}`;

const grid = document.getElementById('grid');
for (const loader of loaders) {
  const cell = document.createElement('div');
  cell.className = 'cell';

  const el = document.createElement('span');
  el.className = loader.name;
  if (loader.requiresChildren) {
    // child-driven loaders (dots, wave, grid, cascade, signal, matrix, helix, mosaic)
    const count = /grid|mosaic/.test(loader.name) ? 9 : 5;
    for (let i = 0; i < count; i++) el.appendChild(document.createElement('span'));
  }
  if (loader.name === 'sds-loader-type') el.textContent = 'loading…';

  const label = document.createElement('code');
  label.textContent = loader.name;

  cell.append(el, label);
  grid.appendChild(cell);
}
