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
      // Bridged to the CSS custom properties in app/globals.css so utilities and
      // inline styles resolve to the same value in both themes.
      colors: {
        bg: {
          primary: "var(--color-bg-primary)",
          secondary: "var(--color-bg-secondary)",
          tertiary: "var(--color-bg-tertiary)",
          elevated: "var(--color-bg-elevated)",
        },
        accent: {
          gold: "var(--color-accent-gold)",
          "gold-dark": "var(--color-accent-gold-dark)",
          maroon: "var(--color-accent-maroon)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          default: "var(--color-border-default)",
        },
      },
      fontFamily: {
        sans: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      borderRadius: {
        // Shared scale: 8 / 12 / 16. Nothing else.
        sm: "8px",
        md: "12px",
        lg: "12px",
        xl: "12px",
        "2xl": "16px",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
