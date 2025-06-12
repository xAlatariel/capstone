import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
      clientPort: 5173
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})