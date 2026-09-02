import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content/content.ts"),
      },

      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "content") {
            return "content.js";
          }

          return "assets/[name]-[hash].js";
        },
      },
    },
  },
})
