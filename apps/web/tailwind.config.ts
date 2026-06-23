import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        "ink-light": "#0f0f10",
        "ink-surface": "#1a1a1c",
        cream: "#f5f5f5",
        "cream-bright": "#ffffff",
        coral: "#ff6b6b",
        "coral-light": "#ff8e53",
        amber: "#fbbf24",
        sky: "#38bdf8",
        violet: "#a78bfa",
        emerald: "#34d399",
        border: "var(--border, #2a2a2c)",
        muted: "var(--muted, #7a7a7c)",
        subtle: "var(--subtle, #4a4a4c)",
        surface: "var(--surface, #0f0f10)",
        card: "var(--card, #131314)",
        primary: "var(--primary, #f5f5f5)",
        "on-bg": "var(--on-bg, #f5f5f5)",
        "on-surface": "var(--on-surface, #f5f5f5)",
      },
      spacing: {
        "s1": "5px",
        "s2": "8px",
        "s3": "13px",
        "s4": "21px",
        "s5": "34px",
        "s6": "55px",
      },
      fontFamily: {
        bauhaus: ["Archivo Black", "Archivo", "sans-serif"],
        sans: ["Archivo", "sans-serif"],
      },
      fontSize: {
        "bauhaus-55": ["55px", { lineHeight: "0.95", letterSpacing: "-2px", fontWeight: "800" }],
        "bauhaus-34": ["34px", { lineHeight: "0.95", letterSpacing: "-1px", fontWeight: "800" }],
        "bauhaus-21": ["21px", { lineHeight: "1", letterSpacing: "-0.5px", fontWeight: "700" }],
        "bauhaus-13": ["13px", { lineHeight: "1.2", fontWeight: "700" }],
      },
      keyframes: {
        "zoom-in": {
          "0%": { transform: "scale(var(--zoom-start)) translate(var(--zoom-translate))", opacity: "0" },
          "100%": { transform: "scale(1) translate(0)", opacity: "1" },
        },
        "zoom-out": {
          "0%": { transform: "scale(1) translate(0)", opacity: "1" },
          "100%": { transform: "scale(var(--zoom-start)) translate(var(--zoom-translate))", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 107, 107, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(255, 107, 107, 0.4)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "zoom-in": "zoom-in 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "zoom-out": "zoom-out 350ms ease-in forwards",
        "fade-in": "fade-in 300ms ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
