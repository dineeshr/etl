import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        detail: path.resolve(__dirname, "/public/detail.html"),
        report: path.resolve(__dirname, "/public/report.html"),
      },
    },
  },
});