/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-arabic)"],
        faseyha: ['var(--font-custom)'],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

export default config


