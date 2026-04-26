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
        // Earthy base palette
        cream: {
          50:  "#fdfcfb",
          100: "#f9f6f2",
          200: "#f2ebe0",
          300: "#e8dece",
          400: "#d4c4a8",
        },
        moss: {
          50:  "#f0f4f0",
          100: "#d4e4d2",
          200: "#9ec49a",
          300: "#6a9f64",
          400: "#4a7c44",
          500: "#2d5a29",
          600: "#1e3d1b",
          700: "#122410",
        },
        amber: {
          50:  "#fffbf0",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fbbf24",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
        },
        rust: {
          50:  "#fdf3ef",
          100: "#fbe0d4",
          200: "#f4b89a",
          300: "#eb8a62",
          400: "#d4603a",
          500: "#b84220",
          600: "#8b2f14",
        },
        // Neutral grays
        stone: {
          50:  "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "Geist", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #1e3d1b 0%, #2d5a29 40%, #4a7c44 70%, #d97706 100%)",
        "card-gradient":
          "linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
        "glow-moss":
          "radial-gradient(ellipse at center, rgba(74,124,68,0.35) 0%, transparent 70%)",
        "glow-amber":
          "radial-gradient(ellipse at center, rgba(217,119,6,0.3) 0%, transparent 70%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "soft":
          "0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        "card":
          "0 4px 32px rgba(0,0,0,0.08), 0 1px 8px rgba(0,0,0,0.04)",
        "card-hover":
          "0 8px 48px rgba(0,0,0,0.12), 0 2px 12px rgba(0,0,0,0.06)",
        "glow-moss":
          "0 0 40px rgba(74,124,68,0.3), 0 0 80px rgba(74,124,68,0.15)",
        "glow-amber":
          "0 0 40px rgba(217,119,6,0.25), 0 0 80px rgba(217,119,6,0.1)",
        "glass":
          "0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)",
        "nav": "0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "fade-up": "fadeUp 0.7s ease forwards",
        "fade-up-delay": "fadeUp 0.7s 0.2s ease forwards both",
        "slide-in-right": "slideInRight 0.5s ease forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
