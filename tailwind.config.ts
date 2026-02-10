import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
        mono: ["var(--font-fira-code)", "monospace"],
      },
      colors: {
        primary: {
          DEFAULT: "#c89a0e",
          hover: "#b08a08",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#c95f84",
          light: "#e07da0",
          foreground: "#ffffff",
        },
        background: {
          DEFAULT: "#faf8f4",
          surface: "#ffffff",
          "surface-alt": "#f1efea",
        },
        text: {
          heading: "#1c1b18",
          body: "#4d4b47",
          muted: "#908e88",
          light: "#ffffff",
        },
        status: {
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
        },
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#f5c542",
          500: "#eab308",
          600: "#ca8a04",
          700: "#a16207",
        },
        border: "#e5e3de",
        input: "#f1efea",
        ring: "#c89a0e",
        foreground: "#4d4b47",
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "12px",
        md: "12px",
        lg: "20px",
        xl: "28px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 12px rgba(0, 0, 0, 0.05)",
        hover: "0 8px 30px rgba(0, 0, 0, 0.08)",
        glow: "0 0 30px rgba(200, 154, 14, 0.12)",
        "glow-sm": "0 0 15px rgba(200, 154, 14, 0.08)",
        "glow-strong": "0 0 50px rgba(200, 154, 14, 0.2)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)",
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "slide-down": "slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(200, 154, 14, 0.08)" },
          "50%": { boxShadow: "0 0 40px rgba(200, 154, 14, 0.18)" },
        },
      },
      backgroundImage: {
        "gradient-gold": "linear-gradient(135deg, #d4a520, #c07b10, #d4a520)",
        "gradient-gold-subtle":
          "linear-gradient(135deg, rgba(200,154,14,0.08), rgba(192,123,16,0.04))",
        "gradient-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))",
        "gradient-radial":
          "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
