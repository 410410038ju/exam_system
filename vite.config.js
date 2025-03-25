import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // 打包的時候用的
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')  // 配置 @ 為 src 目錄
    }
  }
})
