/** @type {import('tailwindcss').Config} */
/* eslint-env node */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "Manrope Variable, sans serif",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
