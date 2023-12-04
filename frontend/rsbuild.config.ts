import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import tailwindcss from "tailwindcss";

export default defineConfig({
  plugins: [pluginReact()],
  tools: {
    postcss(config) {
      // @ts-ignore
      config.postcssOptions?.plugins?.push(tailwindcss);
    },
  },
});
