import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // CodeLess brand tokens (locked to the social ad set)
        navy: {
          DEFAULT: "#1A2744",
          deep: "#141F38",
          800: "#1A2744",
          900: "#141F38",
          950: "#0E1526",
        },
        orange: {
          DEFAULT: "#FF6B3D",
          bright: "#FF7A45",
        },
        ink: "#F4F6FB",
        muted: "#8A96B0",
        success: "#3DDC84",
        danger: "#E23B3B",
        avatar: {
          green: "#3DDC84",
          blue: "#5B8DEF",
          red: "#E23B3B",
          purple: "#9B6DFF",
          orange: "#FF6B3D",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-georgian)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "var(--font-georgian)", "system-ui", "sans-serif"],
        georgian: ["var(--font-georgian)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(255, 107, 61, 0.55)",
        "glow-lg": "0 0 80px -10px rgba(255, 107, 61, 0.5)",
        card: "0 20px 60px -24px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "radial-navy":
          "radial-gradient(120% 120% at 50% 20%, #1E2C4E 0%, #1A2744 40%, #141F38 75%, #0E1526 100%)",
        "orange-sheen":
          "linear-gradient(135deg, #FF7A45 0%, #FF6B3D 55%, #F0532A 100%)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "float-slow": "float-slow 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
