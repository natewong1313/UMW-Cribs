import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import eslint from "vite-plugin-eslint2"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    eslint({
      fix: false,
    }),
  ],
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
    },
  },
})
