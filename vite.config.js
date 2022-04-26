import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // port: 3454,
    proxy: {
      '^/hello': {
        target: 'http://localhost:8081/',
        changeOrigin: true
      },
      '^/load': {
        target: 'http://localhost:8081/',
        changeOrigin: true
      },
      '^/save': {
        target: 'http://localhost:8081/',
        changeOrigin: true
      },
      '^/upload': {
        target: 'http://localhost:8081/',
        changeOrigin: true
      },
    }
  }
})
