import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://otut.org',
  trailingSlash: 'never',
  build: { format: 'file' },
  compressHTML: true,
});
