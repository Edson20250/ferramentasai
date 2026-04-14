import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        /* Brand greens */
        brand: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        /* Stripe navy tones */
        ink: {
          900: '#0a2540',
          800: '#1a3a5c',
          700: '#2a4f78',
          600: '#425466',
          500: '#8898aa',
        },
      },
      letterSpacing: {
        tighter: '-0.035em',
        tight:   '-0.025em',
        snug:    '-0.015em',
      },
      boxShadow: {
        'stripe-sm': '0 2px 5px -1px rgba(50,50,93,0.12), 0 1px 3px -1px rgba(0,0,0,0.07)',
        'stripe-md': '0 6px 20px -5px rgba(50,50,93,0.12), 0 3px 8px -3px rgba(0,0,0,0.07)',
        'stripe-lg': '0 13px 40px -5px rgba(50,50,93,0.15), 0 8px 16px -8px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in':  'fade-in 0.4s ease forwards',
        'fade-up':  'fade-up 0.5s ease forwards',
        'marquee':  'marquee-scroll 32s linear infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
