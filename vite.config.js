import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vite 配置
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://36.yongcun.cc:5000',
        changeOrigin: true,

      },
      '/Film': {
        target: 'http://36.yongcun.cc:5000',
        changeOrigin: true,
      },
    },
  },
});
