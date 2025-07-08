import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to backend server
      '/vacancy-session': {
        target: 'https://04t4kkeiff.execute-api.eu-central-1.amazonaws.com',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/vacancy-session/, '') // optional: remove /api prefix
      }
    }
  }
})
