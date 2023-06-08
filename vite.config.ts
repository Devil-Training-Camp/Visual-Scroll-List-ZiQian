import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({
    insertTypesEntry: true,
    copyDtsFiles: false
  })],
  build: {
    outDir: 'dist',
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
