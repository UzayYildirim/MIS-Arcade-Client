import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  root: '.',
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Ensure proper static asset handling
    assetsDir: 'assets',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Ensure consistent asset naming for caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Optimize chunk splitting for better caching
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          pocketbase: ['pocketbase']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3051,
    host: '0.0.0.0', // Allow external connections
    strictPort: true
  },
  optimizeDeps: {
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  }
}))


