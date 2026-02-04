import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [devtools(), solid()],
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../internal/embed/frontend/dist',
    emptyOutDir: true,
  },
});
