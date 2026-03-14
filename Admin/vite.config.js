/**
 * Vite Configuration
 *
 * - React plugin for JSX/HMR support
 * - Proxy: forwards all /api/* requests to the Express backend on port 5001
 *   so the frontend can call fetch('/api/contacts') without CORS issues.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
