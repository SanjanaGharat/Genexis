import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07090f",
          900: "#0b0e17",
          800: "#111523",
          700: "#171c2e",
          600: "#232a42",
        },
        chrono: {
          // "chronological" — cool, steady, calendar-blue
          300: "#8fb8ff",
          400: "#5f92ff",
          500: "#3f6fe0",
          600: "#2f52ad",
        },
        bio: {
          // "biological" — warm coral, living/urgent
          300: "#ffb199",
          400: "#ff8a66",
          500: "#f2643e",
          600: "#c94726",
        },
        cell: {
          // signature bioluminescent accent used sparingly
          300: "#b8ffe0",
          400: "#6dffc4",
          500: "#2be3a0",
          600: "#17b481",
        },
        parchment: "#f3efe6",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "aurora": "radial-gradient(60% 50% at 20% 20%, rgba(111,255,196,0.18) 0%, rgba(111,255,196,0) 60%), radial-gradient(50% 40% at 85% 15%, rgba(255,138,102,0.16) 0%, rgba(255,138,102,0) 60%), radial-gradient(70% 60% at 50% 100%, rgba(95,146,255,0.14) 0%, rgba(95,146,255,0) 60%)",
        "grain": "url('/noise.svg')",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
      },
      animation: {
        drift: "drift 6s ease-in-out infinite",
        spinSlow: "spinSlow 40s linear infinite",
        spinSlower: "spinSlow 70s linear infinite",
        pulseSoft: "pulseSoft 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
