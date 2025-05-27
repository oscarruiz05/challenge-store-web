import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    deps: {
      inline: ["vue", "vue-router"],
    },
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.spec.ts",
        "**/*.test.ts",
        "src/main.ts",
        "src/App.vue",
      ],
      include: ["src/**/*.{js,ts,vue}"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
