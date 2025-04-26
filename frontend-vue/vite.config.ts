import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js', // Явно указываем PostCSS-конфиг
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/docs': 'http://localhost:3000',
      '/api-docs': 'http://localhost:3000',
      '/swagger.json': 'http://localhost:3000',
    },
  },
});