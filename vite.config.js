/// <reference types="vitest/config" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {},
  plugins: [dts()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/libs/index.ts"),
      },
      name: "uc-video",
      formats: ["es", "umd"],
      fileName: (format) => `uc-video.${format}.js`,
    },
    rollupOptions: {
      treeshake: "smallest",
      external: [],
    },
  },
});
