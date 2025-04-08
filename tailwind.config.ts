import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        macha: "#A8C686", // 🍵 light matcha green
      },
    },
  },
  plugins: [],
}

export default config
