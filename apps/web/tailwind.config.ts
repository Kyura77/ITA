import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0f1c",
        panel: "#111827",
        line: "#1f2937",
        accent: "#0891b2",
        accentStrong: "#0e7490",
        sand: "#f3f4f6",
      },
      boxShadow: {
        panel: "0 20px 60px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
