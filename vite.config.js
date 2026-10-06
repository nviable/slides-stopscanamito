import { defineConfig } from 'vite';

// base './' keeps every path relative, so the build works at slides.stopandscan.org,
// on GitHub Pages under a sub-path, or opened from any static host.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'build',
    emptyOutDir: true
  },
  server: { port: 5173, open: false }
});
