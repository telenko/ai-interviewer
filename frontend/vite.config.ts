import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tanstackRouter from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
// @ts-ignore
import { resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      // @ts-ignore
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy /api requests to backend server
      '/vacancy-session': {
        target: 'https://4y464pdfq7.execute-api.eu-central-1.amazonaws.com/interviewer-stage',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1600, // розмір у кілобайтах
  },
});
