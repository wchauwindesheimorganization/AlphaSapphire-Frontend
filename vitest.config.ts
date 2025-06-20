import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["lcov", "text-summary"],
      reportsDirectory: "./coverage",

    },

  },
});
