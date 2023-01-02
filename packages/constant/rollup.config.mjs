import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import dts from "rollup-plugin-dts";

const config = defineConfig([
  {
    input: "./index.ts",
    output: [{ file: "dist/index.js", format: "cjs" }],
    plugins: [esbuild()],
  },
  {
    input: "./index.ts",
    output: [{ file: "dist/index.d.ts", format: "cjs" }],
    plugins: [dts()],
  },
]);

export default config;
