import 'dotenv/config';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

declare var process: {
  env: Partial<Record<string, string>>;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: process.env.API_BASE_URL === undefined ? {} : {
      '/api': {
        target: process.env.API_BASE_URL,
        changeOrigin: true,
      }
    }
  }
})
