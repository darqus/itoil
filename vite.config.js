const path = require('path');

import { defineConfig, } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteSingleFile, } from './plugins/vite-plugin-singlefile';

const __APP_VERSION__ = '2.0.14';

// https://vitejs.dev/config/
export default defineConfig(({ mode, }) => ({
  define: {
    __DEBUG__: mode === 'development',
    __APP_VERSION__: JSON.stringify(__APP_VERSION__),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [ vue(), viteSingleFile(), ],
  build: {
    target: 'safari11',
    // minify: false,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    brotliSize: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: false,
        manualChunks: () => 'everything.js',
      },
    },
  },
}));
