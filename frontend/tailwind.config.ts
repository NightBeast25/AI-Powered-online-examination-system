import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",    // Vibrant Blue
        primaryHover: "#2563EB",
        secondary: "#8B5CF6",  // Vibrant Violet
        background: "#0F172A", // Deep Slate
        surface: "#1E293B",    // Elevated Slate
        border: "#334155",
        textPrimary: "#F8FAFC",
        textMuted: "#94A3B8",
        success: "#10B981",    // Emerald
        warning: "#F59E0B",    // Amber
        danger: "#EF4444",     // Rose
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config
