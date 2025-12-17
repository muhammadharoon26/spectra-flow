import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to Docker network
    strictPort: true,
    port: 5173, // Port mapped in docker-compose
    watch: {
      usePolling: true, // Fix for Windows file changes not triggering hot-reload
    },
  },
});
