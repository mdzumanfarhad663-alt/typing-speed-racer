import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f0a000",
          pink: "#ffeef0",
          highlight: "#ffd700",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
