// vite.config.js
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const PACKAGE_NAME = "uc-video";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/libs/index.ts"),
      name: PACKAGE_NAME,
      fileName: PACKAGE_NAME,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  plugins: [
    dts({ insertTypesEntry: true }),
  ],
});
