import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@shared": resolve(__dirname, "../shared/src"),
    },
  },
  build: {
    outDir: resolve(__dirname, "../dist/client"),
    emptyOutDir: true,
  },
  cacheDir: "../node_modules/.vite",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/global/variables" as *;`,
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
