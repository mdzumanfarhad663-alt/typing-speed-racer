import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: "#29b6d8",
          yellow: "#ffd400",
          navy: "#0b1f4d",
          green: "#0b6e4f",
          purple: "#6c1d8b",
          maroon: "#8e2430",
          cream: "#f5f5f0",
          highlight: "#ffd700",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
