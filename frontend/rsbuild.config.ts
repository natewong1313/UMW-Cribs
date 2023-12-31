import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import tailwindcss from "tailwindcss"

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    postcss(config) {
      // @ts-ignore
      config.postcssOptions?.plugins?.push(tailwindcss)
    },
  },
  html: {
    title: "UMW Cribs",
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3000",
    },
  },
})
