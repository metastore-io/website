import { defineConfig } from 'astro/config';
import { site } from './src/site';

// Plain static HTML, no adapter: GitHub Pages serves `dist/` (README.md).
export default defineConfig({
  site: site.origin,
  base: site.base,
  output: 'static',
  trailingSlash: 'ignore',
  // Styles stay files, never inline, so the pages' content security policy needs no 'unsafe-inline'.
  build: { format: 'file', inlineStylesheets: 'never' },
});
