import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const distExpo = resolve(root, 'dist-expo');

if (!existsSync(distExpo)) {
  console.error('dist-expo not found. Run expo export first.');
  process.exit(1);
}

// Copy Expo index.html to dist root (the functional app entry point)
cpSync(resolve(distExpo, 'index.html'), resolve(dist, 'index.html'), { overwrite: true });

// Copy _expo/ bundle folder
if (existsSync(resolve(distExpo, '_expo'))) {
  cpSync(resolve(distExpo, '_expo'), resolve(dist, '_expo'), { recursive: true, overwrite: true });
}

// Copy favicon if present
if (existsSync(resolve(distExpo, 'favicon.ico'))) {
  cpSync(resolve(distExpo, 'favicon.ico'), resolve(dist, 'favicon.ico'), { overwrite: true });
}

// Copy vector icon fonts with correct hashed names
// The bundle references paths like /assets/.../Ionicons.HASH.ttf
// but source files are just Ionicons.ttf (no hash). We parse the bundle to match them.
const fontsSrc = resolve(root, 'node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts');
const fontsBase = 'assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts';

if (existsSync(fontsSrc)) {
  const jsDir = resolve(dist, '_expo/static/js/web');
  const jsFiles = existsSync(jsDir) ? readdirSync(jsDir).filter(f => f.endsWith('.js')) : [];

  const fontRefs = new Map(); // hashedName → originalName

  for (const jsFile of jsFiles) {
    const content = readFileSync(resolve(jsDir, jsFile), 'utf8');
    const regex = /\/assets\/node_modules\/@expo\/vector-icons\/[^"]+\/Fonts\/([A-Za-z0-9_]+)\.([a-f0-9]+)\.ttf/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const [, baseName, hash] = match;
      fontRefs.set(`${baseName}.${hash}.ttf`, `${baseName}.ttf`);
    }
  }

  const fontsDest = resolve(dist, fontsBase);
  mkdirSync(fontsDest, { recursive: true });

  for (const [hashedName, originalName] of fontRefs) {
    const src = resolve(fontsSrc, originalName);
    const dest = resolve(fontsDest, hashedName);
    if (existsSync(src)) {
      cpSync(src, dest, { overwrite: true });
    }
  }

  console.log(`Copied ${fontRefs.size} vector icon fonts with hashed names`);
}

// Clean up temp dist-expo
rmSync(distExpo, { recursive: true, force: true });

console.log('Merged Expo Web build into dist/');
