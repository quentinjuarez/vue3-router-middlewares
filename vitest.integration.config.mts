/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "integration",
    environment: "jsdom",
    include: ["tests/integration/**/*.test.ts"],
    globals: true,
  },
});
