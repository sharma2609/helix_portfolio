import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { backendPlugin } from "./plugins/backend.mjs";

const apiTarget = `http://127.0.0.1:${process.env.BACKEND_PORT || 8000}`;

export default defineConfig({
  plugins: [react(), backendPlugin()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
