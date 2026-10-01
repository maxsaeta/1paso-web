const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputSvg = path.resolve(__dirname, '..', 'public', 'assets', 'logo.svg');
const outputDir = path.resolve(__dirname, '..', 'public', 'assets');

const sizes = [48, 96, 128, 180, 192, 256, 384, 512];

async function generateFavicons() {
  console.log('Generando favicons desde logo.svg...');
  console.log('Input:', inputSvg);
  console.log('Output dir:', outputDir);

  if (!fs.existsSync(inputSvg)) {
    console.error('ERROR: No existe el archivo SVG:', inputSvg);
    process.exit(1);
  }

  for (const size of sizes) {
    const outputPng = path.join(outputDir, `favicon-${size}.png`);
    await sharp(inputSvg)
      .resize(size, size, { fit: 'contain', background: { r: 253, g: 253, b: 248, alpha: 1 } })
      .png()
      .toFile(outputPng);
    console.log(`  ✓ favicon-${size}.png`);
  }

  // Generate .ico with multiple sizes (fallback: 256px PNG as favicon.ico)
  const faviconIco = path.join(outputDir, 'favicon.ico');
  await sharp(inputSvg)
    .resize(256, 256, { fit: 'contain', background: { r: 253, g: 253, b: 248, alpha: 1 } })
    .png()
    .toFile(faviconIco);
  console.log('  ✓ favicon.ico (256px PNG as fallback)');

  // apple-touch-icon
  await sharp(inputSvg)
    .resize(180, 180, { fit: 'contain', background: { r: 253, g: 253, b: 248, alpha: 1 } })
    .png()
    .toFile(path.join(outputDir, 'apple-touch-icon.png'));
  console.log('  ✓ apple-touch-icon.png (180px)');

  console.log('Favicons generados en public/assets/');
}

generateFavicons().catch(console.error);
