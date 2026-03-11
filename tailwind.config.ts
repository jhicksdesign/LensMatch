import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gallery: {
          bg: "#FAF8F4",
          surface: "#FFFFFF",
          border: "#E8E3DB",
          "border-light": "#F0ECE6",
          accent: "#A67C3D",
          "accent-hover": "#8E6A30",
          "accent-muted": "rgba(166, 124, 61, 0.07)",
          text: "#1A1714",
          "text-secondary": "#6B635A",
          "text-muted": "#A9A29B",
          error: "#B93E3E",
          success: "#3D7A5A",
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        body: ['"Outfit"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-in": "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        grain: "grain 6s steps(8) infinite",
        shimmer: "shimmer 2.5s ease infinite",
        glow: "glow 4s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-3%, -6%)" },
          "20%": { transform: "translate(-10%, 3%)" },
          "30%": { transform: "translate(5%, -15%)" },
          "40%": { transform: "translate(-3%, 15%)" },
          "50%": { transform: "translate(-10%, 6%)" },
          "60%": { transform: "translate(10%, 0%)" },
          "70%": { transform: "translate(0%, 10%)" },
          "80%": { transform: "translate(2%, 20%)" },
          "90%": { transform: "translate(-6%, 6%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { opacity: "0.3" },
          "100%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
