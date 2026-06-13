/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sea: {
          DEFAULT: '#0B5E8A',
          dark: '#0A4F75',
          light: '#E6F3FA',
        },
        cream: '#FDFAF5',
        ink: '#0F0E0C',
        mist: '#F5F3EE',
        border: '#E2DDD5',
        muted: '#7A756C',
        sand: '#D4A853',
        coral: '#C95B3A',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        card: '12px',
        pill: '20px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.07)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.1)',
      },
      spacing: {
        '4.5': '18px',
        '18': '72px',
        '22': '88px',
      },
    },
  },
  plugins: [],
}

export default config
