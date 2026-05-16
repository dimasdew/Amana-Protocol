/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#121012",
          secondary: "#1C1C1E",
          tertiary: "#252527",
          elevated: "#2E2E30",
        },
        accent: {
          green: "#C9A84C",
          blue: "#800020",
          orange: "#C9A84C",
          purple: "#800020",
          yellow: "#C9A84C",
          red: "#800020",
        },
        border: {
          subtle: "rgba(255,255,255,0.07)",
          default: "rgba(255,255,255,0.12)",
          strong: "rgba(255,255,255,0.2)",
        },
      },
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "ticker": "ticker 30s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
