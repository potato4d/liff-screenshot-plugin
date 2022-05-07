import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: { global: {} },
  root: `${__dirname}/examples`,
  plugins: [preact()],
});
