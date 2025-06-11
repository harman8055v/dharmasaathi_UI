import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))", // slate-200 dark:slate-800
        input: "hsl(var(--input))", // slate-300 dark:slate-700 (example)
        ring: "hsl(var(--ring))", // maroon-700 (focus ring)
        background: "hsl(var(--background))", // white dark:slate-950
        foreground: "hsl(var(--foreground))", // slate-900 dark:slate-50
        primary: {
          // Maroon based
          DEFAULT: "#991b1b", // maroon-800
          foreground: "#ffffff", // white
        },
        secondary: {
          // Grey based
          DEFAULT: "hsl(var(--secondary))", // slate-100 dark:slate-800
          foreground: "hsl(var(--secondary-foreground))", // slate-900 dark:slate-50
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))", // red-600
          foreground: "hsl(var(--destructive-foreground))", // white
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // slate-100 dark:slate-800
          foreground: "hsl(var(--muted-foreground))", // slate-500 dark:slate-400
        },
        accent: {
          // Subtle accent, can be a lighter maroon or grey
          DEFAULT: "hsl(var(--accent))", // maroon-50 dark:maroon-900/30
          foreground: "hsl(var(--accent-foreground))", // maroon-800 dark:maroon-300
        },
        popover: {
          DEFAULT: "hsl(var(--popover))", // white dark:slate-900
          foreground: "hsl(var(--popover-foreground))", // slate-900 dark:slate-50
        },
        card: {
          DEFAULT: "hsl(var(--card))", // white dark:slate-900
          foreground: "hsl(var(--card-foreground))", // slate-900 dark:slate-50
        },
        // Brand color: Deep earthy maroon
        maroon: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b", // Primary Interactive Maroon
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Neutrals: slate will be used for grays
        // Black and White are implicitly available
      },
      borderRadius: {
        lg: "var(--radius)", // 0.5rem
        md: "calc(var(--radius) - 2px)", // 0.375rem
        sm: "calc(var(--radius) - 4px)", // 0.25rem
        xl: "calc(var(--radius) + 4px)", // 0.75rem
        "2xl": "calc(var(--radius) + 8px)", // 1rem
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
