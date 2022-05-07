import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
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
      external: ['react', 'react-dom', '@line/liff'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@line/liff': 'liff',
        }
      }
    }
  },
  plugins: [react()],
})
