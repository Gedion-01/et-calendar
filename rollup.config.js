import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dst from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");

export default [
  // Main build configuration
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss(),
    ],
    external: ["react", "react-dom"],
  },

  // Hooks build configuration
  {
    input: "src/hooks/index.ts",
    output: [
      {
        file: "dist/hooks/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/hooks/index.mjs",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss(),
    ],
    external: ["react", "react-dom"],
  },
  // Library build configuration
  {
    input: "src/lib/index.ts",
    output: [
      {
        file: "dist/lib/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/lib/index.mjs",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss(),
    ],
    external: ["react", "react-dom"],
  },
  // Type definitions for main entry point
  {
    input: "src/index.ts",
    output: {
      file: packageJson.types,
      format: "es",
    },
    plugins: [dst.default()],
    external: [/\.css$/],
  },
  // Type definitions for hooks
  {
    input: "src/hooks/index.ts",
    output: {
      file: "dist/hooks/index.d.ts",
      format: "es",
    },
    plugins: [dst.default()],
  },
  // Type definitions for lib
  {
    input: "src/lib/index.ts",
    output: {
      file: "dist/lib/index.d.ts",
      format: "es",
    },
    plugins: [dst.default()],
  },
];
