import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd())
  return {
    headers: {
      'Permissions-Policy': 'microphone=https://dev-matterhorn.labs.jb.gg,https://matterhorn.labs.jb.gg,self,https://kineto.dev'
    },
    build: {
      chunkSizeWarningLimit: 5000,
    },
    plugins: [react(), EnvironmentPlugin('all', {prefix: 'VITE_', defineOn: 'process.env'})],
    server: {
      proxy: {
        [env.VITE_BACKEND_URL]: {
          target: `http://localhost:${env.BACKEND_PORT || 8000}`,
          changeOrigin: true,
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
