import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "LIFF ScreeenShot Plugin",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['@line/liff'],
      output: {
        globals: {
          '@line/liff': 'liff',
        }
      }
    }
  },
  plugins: [preact()],
})
