import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  define: {
    "process.env.VITE_API_TOKEN": JSON.stringify(
      "a85d08400c622b50b18b61e239b9903645297196"
    ),
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://harf.roshan-ai.ir",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
