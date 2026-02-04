import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bot-dashboard/', // 這裡填入你的 GitHub 倉庫名稱，前後都要有斜線
})