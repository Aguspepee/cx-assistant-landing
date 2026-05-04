import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers — keeps bundle smaller
    target: 'es2018',
    // Enable CSS minification
    cssMinify: true,
    // Split large chunks for better caching and loading.
    // React + react-dom MUST live in the same chunk as MUI/emotion to prevent
    // "Cannot set properties of undefined (setting 'AsyncMode')" at init time.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/scheduler') ||
            id.includes('node_modules/@mui') ||
            id.includes('node_modules/@emotion')
          ) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/three') || id.includes('node_modules/simplex-noise')) {
            return 'three-vendor';
          }
        },
      },
    },
  },
})
