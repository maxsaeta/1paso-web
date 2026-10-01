import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://neuropaso.netlify.app',
  outDir: 'dist',
  server: { port: 4321, host: '0.0.0.0' },
  integrations: [sitemap()],
});
