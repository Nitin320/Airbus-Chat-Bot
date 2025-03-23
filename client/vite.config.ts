import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/chat': {
        target: 'https://chatbot-server-nult675cw-nitin320s-projects.vercel.app',
        changeOrigin: true,
        secure: true,
      },
    },
  }
});
