import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'es',
    minify: false,
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: 'Vue'
        },
        dir: 'dist'
      }
    },
    lib: {
      entry: './src/index.ts',
      name: 'index',
      fileName: 'index',
      formats: ["es", 'umd', 'cjs']
    }
  }
})
