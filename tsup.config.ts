import { defineConfig } from "tsup";

export default defineConfig({
  // Entry point - the main barrel export
  entry: ["src/index.ts"],

  // Output formats: ESM for modern bundlers, CJS for Node.js/older tools
  format: ["esm", "cjs"],

  // Generate TypeScript declaration files (.d.ts)
  dts: true,

  // Enable source maps for debugging
  sourcemap: true,

  // Clean dist folder before build
  clean: true,

  // External dependencies - don't bundle these
  external: ["react", "react-dom", "framer-motion"],

  // Preserve "use client" directives for React Server Components
  banner: {
    js: '"use client";',
  },

  // Tree-shaking for smaller bundles
  treeshake: true,

  // Minify production builds
  minify: false,

  // Target modern browsers/Node.js
  target: "es2020",
});
