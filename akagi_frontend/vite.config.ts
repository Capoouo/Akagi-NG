import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const pkgVersion = process.env.npm_package_version ?? '0.0.0';
  const displayVersion = isDev ? 'dev' : pkgVersion;

  return {
    plugins: [react(), tailwindcss()],
    base: './',
    build: {
      target: 'esnext',
      outDir: '../dist/renderer',
      emptyOutDir: true,
      cssMinify: 'lightningcss',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __AKAGI_VERSION__: JSON.stringify(displayVersion),
    },
    preview: {
      host: '127.0.0.1',
      port: 24701,
      allowedHosts: true,
    },
  };
});
