import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    prxoy: {
      '/api': 'http://localhost:3000'
    }
  }
})
