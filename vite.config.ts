import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  base: '/Portfolio/',
  plugins: [
    react(),
    ViteImageOptimizer({
      jpg:  { quality: 82 },
      jpeg: { quality: 82 },
      png:  { quality: 85 },
      webp: { quality: 82 },
    }),
  ],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    // Split vendor chunk so React is cached separately from app code
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
