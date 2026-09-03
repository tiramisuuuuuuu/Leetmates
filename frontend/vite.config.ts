import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  if (mode === "content") {
    return {
      plugins: [react()],
      build: {
        outDir: "dist",
        emptyOutDir: false,
        cssCodeSplit: false,
        rolldownOptions: {
          input: resolve(
            __dirname,
            "src/content/content.tsx"
          ),

          output: {
            format: "iife",
            entryFileNames: "content.js",
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith(".css")) {
                return "content.css";
              }
              return "assets/[name]-[hash][extname]";
            },
          },
        },
      },
    };
  }

  return {
    plugins: [react()],
    build: {
      outDir: "dist",
    },
  };
});
