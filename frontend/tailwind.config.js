/** @type {import('tailwindcss').Config} */
import formPlugin from "@tailwindcss/forms"
import animatePlugin from "tailwindcss-animate"
import defaultTheme from "tailwindcss/defaultTheme"
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope Variable", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [formPlugin, animatePlugin],
}
