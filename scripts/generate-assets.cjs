// Genera los PNG derivados del logo.
//
// Fuentes, ambas en public/assets/ que es lo unico que Astro copia a dist/:
//   logo.svg        marca + wordmark "NEUROPASO" (con texto)
//   logo-splash.svg solo la marca (sin texto)
//
// Lo que sale aqui sustituye a la antigua carpeta assets/ de la raiz, que
// contenia el logo previo a la marca (cyan UnPaso, letra "U") y alimentaba
// un script que escribia fuera de dist/, asi que sus resultados nunca
// llegaba a produccion.
//
// Uso: node scripts/generate-assets.cjs

const sharp = require('sharp');
const path = require('path');

const assetsDir = path.resolve(__dirname, '..', 'public', 'assets');

const logoMark = path.join(assetsDir, 'logo-splash.svg');

const BRAND_BG = { r: 253, g: 253, b: 248, alpha: 1 };

// Android recorta el foreground a la zona segura central (72/108 del
// lienzo). El wordmark cae fuera de ahi y se veria cortado, asi que el
// foreground y el monocromo usan la marca sin texto.
const jobs = [
  {
    label: 'icon.png (1024x1024)',
    output: 'icon.png',
    run: () => sharp(logoMark).resize(1024, 1024, { fit: 'contain', background: BRAND_BG }).png(),
  },
  {
    label: 'favicon.png (48x48)',
    output: 'favicon.png',
    run: () => sharp(logoMark).resize(48, 48, { fit: 'contain', background: BRAND_BG }).png(),
  },
  {
    label: 'splash-icon.png (1024x1024)',
    output: 'splash-icon.png',
    run: () => sharp(logoMark).resize(1024, 1024, { fit: 'contain', background: BRAND_BG }).png(),
  },
  {
    label: 'android-icon-foreground.png (432x432)',
    output: 'android-icon-foreground.png',
    run: () => sharp(logoMark).resize(432, 432, { fit: 'contain', background: BRAND_BG }).png(),
  },
  {
    label: 'android-icon-background.png (432x432)',
    output: 'android-icon-background.png',
    run: () =>
      sharp({ create: { width: 432, height: 432, channels: 4, background: BRAND_BG } }).png(),
  },
  {
    label: 'android-icon-monochrome.png (432x432)',
    output: 'android-icon-monochrome.png',
    run: () =>
      sharp(logoMark).resize(432, 432, { fit: 'contain', background: BRAND_BG }).greyscale().png(),
  },
];

async function generateAssets() {
  console.log('Generando PNG desde public/assets/\n');

  for (const job of jobs) {
    await job.run().toFile(path.join(assetsDir, job.output));
    console.log(`  ${job.label}`);
  }

  console.log(`\nListo: ${jobs.length} archivos en public/assets/`);
}

generateAssets().catch((err) => {
  console.error('Error generando los assets:', err);
  process.exit(1);
});
