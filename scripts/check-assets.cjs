/**
 * Comprueba que los PNG derivados de public/assets/ estan al dia.
 *
 * Los generadores se ejecutan en el sitio y despues se mira si han
 * cambiado archivos ya versionados. Si cambian, alguien edito un SVG o
 * cambio sharp sin volver a commitear el resultado, y el repositorio y
 * dist/ dejarian de coincidir.
 */
const { execFileSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

const generators = [
  'scripts/generate-assets.cjs',
  'scripts/generate-favicons.cjs',
  'scripts/generate-og.cjs',
  'scripts/generate-feature-graphic.cjs',
];

for (const gen of generators) {
  console.log(`> ${gen}`);
  execFileSync(process.execPath, [path.join(root, gen)], { stdio: 'inherit' });
}

let changed;
try {
  changed = execFileSync('git', ['diff', '--name-only', '--', 'public/assets'], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
} catch {
  // Fuera de un checkout de git no hay nada que comparar.
  console.log('\nNo es un repositorio git: se omite la comparacion.');
  process.exit(0);
}

if (changed) {
  console.error('\nAssets desactualizados en el repositorio:');
  console.error(
    changed
      .split('\n')
      .map((f) => `  ${f}`)
      .join('\n'),
  );
  console.error('\nEjecuta los generadores y commitea el resultado.');
  process.exit(1);
}

console.log('\nAssets al dia.');
