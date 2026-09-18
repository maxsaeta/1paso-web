import { cpSync, existsSync, rmSync } from 'node:fs';
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

// Clean up temp dist-expo
rmSync(distExpo, { recursive: true, force: true });

console.log('Merged Expo Web build into dist/');
