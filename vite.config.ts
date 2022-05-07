import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: "terser",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "LIFF ScreeenShot Plugin",
      fileName: (format) => `index.${format}.js`,
    },
    terserOptions: { mangle: true },
    rollupOptions: {
      external: ["@line/liff"],
      output: { globals: { "@line/liff": "liff" } },
    },
  },
  plugins: [preact()],
});
