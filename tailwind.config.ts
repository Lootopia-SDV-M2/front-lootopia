import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enable class-based dark mode
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
          DEFAULT: "#edeee8", // Favicon Dominant (Warm White)
          hover: "#fdfdfb", // Lighter shade
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#e88aa5", // Favicon Pink (Mouth)
          light: "#fbcfe8",
          foreground: "#000000",
        },
        background: {
          DEFAULT: "#030303", // Keep Void Black
          surface: "#0A0A0A",
          "surface-alt": "#121212",
        },
        text: {
          heading: "#edeee8", // Match primary
          body: "#eff0ea", // Match secondary
          muted: "#71717A",
          light: "#FFFFFF",
        },
        status: {
          success: "#10B981", // Emerald 500
          warning: "#F59E0B", // Amber 500
          error: "#EF4444", // Red 500
        },
        // Mapping to standard shadcn/tailwind names
        border: "#27272A", // Zinc 800
        input: "#121212", // surface-alt
        ring: "#FFFFFF",
        foreground: "#A1A1AA", // text-body
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "12px", // medium
        md: "12px",
        lg: "24px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 4px 20px rgba(58, 0, 29, 0.05)",
        hover: "0 10px 30px rgba(58, 0, 29, 0.10)",
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      transitionTimingFunction: {
        pomegranate: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      },
      animation: {
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
