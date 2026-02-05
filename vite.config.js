import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.abkdiamond.com',
        changeOrigin: true,
        secure: false,
        // configure bloğunu sildik. Standart proxy ayarı en güvenlisidir.
      },
    },
  },
})