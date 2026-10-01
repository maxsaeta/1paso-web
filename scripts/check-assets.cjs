/**
 * Comprueba que los PNG derivados de public/assets/ estan al dia.
 *
 * Se ejecuta cada generador y se comprueba si el resultado cambia.
 * Si cambia, alguien edito un SVG o cambio sharp sin volver a commitear
 * el resultado, y el repositorio y dist/ dejarian de coincidir.
 *
 * La comparacion es de PIXELES, no de bytes: los binarios precompilados
 * de sharp son especificos de plataforma y codifican el mismo PNG con
 * bytes distintos en Windows y en Linux. Comparar el archivo entero
 * hacia fallar el CI siempre, aunque la imagen sea identica. Asi que se
 * decodifica y se hashea el buffer raw, que si es estable entre sistemas.
 */
const { execFileSync } = require('child_process');
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'public', 'assets');

const generators = [
  'scripts/generate-assets.cjs',
  'scripts/generate-favicons.cjs',
  'scripts/generate-og.cjs',
  'scripts/generate-feature-graphic.cjs',
];

function listDerived() {
  if (!fs.existsSync(assetsDir)) return [];
  return fs
    .readdirSync(assetsDir)
    .filter((f) => f.endsWith('.png') || f.endsWith('.ico'))
    .sort();
}

async function fingerprint(file) {
  // ensureAlpha + srgb hace que dos imagenes visualmente iguales den el
  // mismo hash aunque una traiga canal alfa y la otra no.
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const hash = createHash('sha256').update(data).digest('hex');
  return `${info.width}x${info.height}:${hash}`;
}

async function snapshot(files) {
  const out = new Map();
  for (const f of files) {
    out.set(f, await fingerprint(path.join(assetsDir, f)));
  }
  return out;
}

async function main() {
  const before = await snapshot(listDerived());

  for (const gen of generators) {
    console.log(`> ${gen}`);
    execFileSync(process.execPath, [path.join(root, gen)], { stdio: 'inherit' });
  }

  const after = await snapshot(listDerived());

  const changed = [];
  for (const [file, fp] of after) {
    if (!before.has(file)) {
      changed.push(`${file} (nuevo, sin versionar)`);
    } else if (before.get(file) !== fp) {
      changed.push(`${file} (pixeles distintos)`);
    }
  }
  for (const file of before.keys()) {
    if (!after.has(file)) changed.push(`${file} (ya no se genera)`);
  }

  if (changed.length) {
    console.error('\nAssets desactualizados en el repositorio:');
    for (const c of changed) console.error(`  ${c}`);
    console.error('\nEjecuta los generadores y commitea el resultado.');
    process.exit(1);
  }

  console.log(`\nAssets al dia (${after.size} imagenes por pixeles).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
