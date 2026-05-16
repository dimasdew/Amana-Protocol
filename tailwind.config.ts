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
          primary: "#0A0C10",
          secondary: "#0F1218",
          tertiary: "#161B24",
          elevated: "#1C2433",
        },
        accent: {
          green: "#00E5A0",
          blue: "#0066FF",
          orange: "#FF6B35",
          purple: "#A855F7",
          yellow: "#FFD166",
          red: "#FF4567",
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
