import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcss from "tailwindcss"

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    postcss(config) {
      // @ts-expect-error weird
      config.postcssOptions?.plugins?.push(tailwindcss)
    },
  },
  html: {
    template: "./src/index.html",
    // title: "UMW Cribs",
    favicon: "./src/assets/logo.png",
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
    },
  },
})
