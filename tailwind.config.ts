import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        navy: "#1E293B",
        navyDark: "#0F172A",
        success: "#16A34A",
        warning: "#EA580C",
        muted: "#64748B",
      },
      fontFamily: {
        siliguri: ["var(--font-siliguri)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;