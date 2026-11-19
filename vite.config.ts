import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  // Preview and demonstration builds are noindex by default. Only VITE_INDEXABLE=true (a reviewed production build) allows indexing.
  const robots = env.VITE_INDEXABLE === 'true' ? 'index, follow' : 'noindex, nofollow';
  const buildTimestamp = new Date().toISOString();
  const buildId = `ba-${buildTimestamp.replace(/[-:TZ.]/g, '').slice(0, 12)}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId),
      __APP_BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp),
      __APP_MODE__: JSON.stringify(mode),
    },
    plugins: [
      react(),
      tailwindcss(),
      {name: 'robots-env', transformIndexHtml: (html: string) => html.replace('%ROBOTS%', robots)},
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
