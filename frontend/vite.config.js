import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      host: true,
      port: parseInt(env.VITE_FRONTEND_PORT) || 5173,
      proxy: {
        '/upload': {
          target: env.VITE_FRONTEND_API_URL,
          changeOrigin: true,
        },
        '/files': {
          target: env.VITE_FRONTEND_API_URL,
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_FRONTEND_API_URL,
          changeOrigin: true,
        },
        '/delete': {
          target: env.VITE_FRONTEND_API_URL,
          changeOrigin: true,
        },
        '/file-info': {
          target: env.VITE_FRONTEND_API_URL,
          changeOrigin: true,
        },
        '/download': {
          target: env.VITE_FRONTEND_API_URL,
          changeOrigin: true,
        },
      }
    },
    define: {
      'import.meta.env.VITE_FRONTEND_API_URL': JSON.stringify(env.VITE_FRONTEND_API_URL),
      'import.meta.env.VITE_UPLOAD_DIR': JSON.stringify(env.VITE_UPLOAD_DIR)
    }
  };
});
