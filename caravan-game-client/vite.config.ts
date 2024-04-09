import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  base: '',
  server: {
    port: 8080,
  },
  build: {
    rollupOptions: {},
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@pages': path.resolve(__dirname, './src/view/pages'),
      '@components': path.resolve(__dirname, './src/view/components'),
      '@styles': path.resolve(__dirname, './src/view/styles'),
      '@store': path.resolve(__dirname, './src/store'),
      '@model': path.resolve(__dirname, './src/model'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
});
