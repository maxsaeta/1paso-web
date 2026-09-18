import { defineConfig } from 'astro/config';

export default defineConfig({
  outDir: 'dist',
  server: { port: 4321, host: '0.0.0.0' },
});
