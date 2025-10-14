/// <reference types="vitest/config" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",

      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
      all: true,
      exclude: ["**/node_modules/**", "**/dist/**"],
    },
    projects: [
      {
        resolve: {
          alias: {
            "@": __dirname,
          },
        },
        test: {
          include: ["./**/*.e2e.test.ts", "./**/*.e2e.test.tsx"],
          browser: {
            provider: "playwright",
            enabled: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/libs/index.ts"),
      },
      name: "uc-video",
      fileName: "uc-video",
    },
    rollupOptions: {
      treeshake: "smallest",
      external: [],
    },

    resolve: {
      alias: {
        "@": resolve(__dirname),
      },
    },
  },
});
