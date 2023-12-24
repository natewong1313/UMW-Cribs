/** @type {import("prettier").Config} */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  singleQuote: false,
  importOrder: ["^@ui/(.*)$", "^[./]"],
  plugins: [
    // "@trivago/prettier-plugin-sort-imports",
    require.resolve("prettier-plugin-tailwindcss"),
  ],
}

module.exports = config
