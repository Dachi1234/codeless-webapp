import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#1A2744", deep: "#141F38", 950: "#0E1526" },
        orange: { DEFAULT: "#FF6B3D", bright: "#FF7A45" },
        ink: "#F4F6FB",
        muted: "#8A96B0",
        success: "#3DDC84",
        danger: "#E23B3B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(255, 107, 61, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
