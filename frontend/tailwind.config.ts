import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F6AF5",
        secondary: "#7C3AED",
        background: "#F8F9FC",
        surface: "#FFFFFF",
        border: "#E4E8F0",
        textPrimary: "#1A1F36",
        textMuted: "#8A94A6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
} satisfies Config
