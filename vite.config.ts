import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 5173 },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    tailwindcss(),
    TanStackRouterVite({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
});
