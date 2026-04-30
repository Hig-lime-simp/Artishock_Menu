import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
    '/api': {
      // Proxy API requests to the backend server running on port 3001
      target: 'http://localhost:3001',
      changeOrigin: true
    },
        '/uploads': {
          // Proxy image upload requests to the backend server (port 3001)
          target: 'http://localhost:3001',
          changeOrigin: true
        }
    }
  }
})
