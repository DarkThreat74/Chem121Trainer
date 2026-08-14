import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#09090b",
          card: "#111113",
          elevated: "#18181b",
          input: "#1c1c20",
          hover: "#1f1f23",
        },
        border: {
          DEFAULT: "#27272a",
          subtle: "#1e1e22",
          strong: "#3f3f46",
        },
        accent: {
          DEFAULT: "#818cf8",
          hover: "#6366f1",
          muted: "#818cf820",
          glow: "#818cf840",
        },
        ok: {
          DEFAULT: "#34d399",
          muted: "#34d39920",
        },
        warn: {
          DEFAULT: "#fbbf24",
          muted: "#fbbf2420",
        },
        err: {
          DEFAULT: "#f87171",
          muted: "#f8717120",
        },
        muted: "#71717a",
        text: {
          DEFAULT: "#fafafa",
          secondary: "#a1a1aa",
          tertiary: "#71717a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-top": "env(safe-area-inset-top, 0px)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s ease-out",
        "shake": "shake 0.4s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
