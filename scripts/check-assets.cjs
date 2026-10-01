/**
 * Comprueba que los PNG derivados de public/assets/ estan al dia.
 *
 * Que pasara: se ejecuta cada generador y se comprueba si el resultado
 * cambia. Si cambia, alguien edito un SVG o cambio sharp sin volver a
 * commitear el resultado, y el repositorio y dist/ dejarian de coincidir.
 *
 * Por que NO se comparan bytes ni pixeles
 * ---------------------------------------
 * Los SVG se rasterizan con sharp, y los SVG llevan <text> con
 * font-family "system-ui, -apple-system, Segoe UI, Roboto, sans-serif".
 * En Windows eso resuelve a Segoe UI y en Linux cae a la sans-serif del
 * sistema, de modo que los glifos se dibujan con metricas distintas. La
 * imagen resultante es visualmente equivalente pero NO identica pixel a
 * pixel ni byte a byte, en el mismo sistema y entre sistemas.
 *
 * Por eso el control no intenta comparar la imagen. Compara dos cosas
 * que si son reproducibles en cualquier plataforma:
 *
 *   1. El hash sha256 de cada SVG de origen. Si alguien edita un SVG y no
 *      vuelve a generar las PNG, el hash cambia y aqui se ve.
 *   2. Las dimensiones de cada PNG derivada. Si falta un archivo o el
 *      generador cambio el tamano, tambien se ve.
 *
 * Para actualizar el manifiesto de forma deliberada:
 *   npm run assets:manifest
 */
const { execFileSync } = require('child_process');
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'public', 'assets');
const manifestPath = path.join(assetsDir, 'manifest.json');

const generators = [
  'scripts/generate-assets.cjs',
  'scripts/generate-favicons.cjs',
  'scripts/generate-og.cjs',
  'scripts/generate-feature-graphic.cjs',
];

function listFiles(exts) {
  if (!fs.existsSync(assetsDir)) return [];
  return fs
    .readdirSync(assetsDir)
    .filter((f) => exts.some((e) => f.endsWith(e)))
    .sort();
}

function sha256(file) {
  return createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/** current() devuelve el estado que hay que contrastar con el manifiesto. */
async function current() {
  const sources = {};
  for (const f of listFiles(['.svg'])) {
    sources[f] = sha256(path.join(assetsDir, f));
  }

  const derived = {};
  for (const f of listFiles(['.png', '.ico'])) {
    const meta = await sharp(path.join(assetsDir, f)).metadata();
    derived[f] = `${meta.width}x${meta.height}`;
  }

  return { sources, derived };
}

function diff(expected, actual, label, problems) {
  for (const [name, value] of Object.entries(expected)) {
    if (!(name in actual)) {
      problems.push(`${label} ${name}: estaba en el manifiesto y ya no existe`);
    } else if (actual[name] !== value) {
      problems.push(`${label} ${name}: manifiesto ${value}, ahora ${actual[name]}`);
    }
  }
  for (const name of Object.keys(actual)) {
    if (!(name in expected)) problems.push(`${label} ${name}: no estaba en el manifiesto`);
  }
}

async function main() {
  const writeManifest = process.argv.includes('--write');

  if (writeManifest) {
    for (const gen of generators) {
      console.log(`> ${gen}`);
      execFileSync(process.execPath, [path.join(root, gen)], { stdio: 'inherit' });
    }
    const state = await current();
    fs.writeFileSync(manifestPath, JSON.stringify(state, null, 2) + '\n', 'utf8');
    console.log(
      `\nManifiesto actualizado: ${Object.keys(state.sources).length} fuentes, ${Object.keys(state.derived).length} derivadas.`,
    );
    return;
  }

  if (!fs.existsSync(manifestPath)) {
    console.error('\nNo existe public/assets/manifest.json.');
    console.error('Generalo una vez con: npm run assets:manifest');
    process.exit(1);
  }

  for (const gen of generators) {
    console.log(`> ${gen}`);
    execFileSync(process.execPath, [path.join(root, gen)], { stdio: 'inherit' });
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const state = await current();

  const problems = [];
  diff(manifest.sources, state.sources, 'SVG', problems);
  diff(manifest.derived, state.derived, 'PNG', problems);

  if (problems.length) {
    console.error('\nLos assets derivados no cuadran con el manifiesto:');
    for (const p of problems) console.error(`  ${p}`);
    console.error('\nSi el cambio es intencionado, regenera y actualiza con:');
    console.error('  npm run assets:manifest');
    process.exit(1);
  }

  const n = Object.keys(state.derived).length;
  console.log(`\nAssets al dia (${n} derivadas, ${Object.keys(state.sources).length} fuentes).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
