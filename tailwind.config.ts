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
          DEFAULT: "#0a0a0b",
          card: "#131316",
          elevated: "#1a1a1f",
          input: "#1e1e24",
        },
        border: {
          DEFAULT: "#27272a",
          subtle: "#1e1e22",
        },
        accent: {
          DEFAULT: "#6366f1",
          hover: "#5558e3",
          muted: "#6366f133",
        },
        ok: "#22c55e",
        warn: "#f59e0b",
        err: "#ef4444",
        muted: "#71717a",
        text: {
          DEFAULT: "#fafafa",
          secondary: "#a1a1aa",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      spacing: {
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
        "safe-top": "env(safe-area-inset-top, 0px)",
      },
    },
  },
  plugins: [],
};

export default config;
