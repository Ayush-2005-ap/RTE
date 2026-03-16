import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A2744',
          50: '#e8ecf4',
          100: '#c5cede',
          200: '#9aaec8',
          300: '#6f8eb2',
          400: '#4d739f',
          500: '#2b578c',
          600: '#1A2744',
          700: '#152038',
          800: '#10182c',
          900: '#0b1020',
        },
        saffron: {
          DEFAULT: '#E8872A',
          50: '#fdf3e7',
          100: '#fae1c2',
          200: '#f5c98a',
          300: '#f0b152',
          400: '#ec991a',
          500: '#E8872A',
          600: '#c66e15',
          700: '#a45510',
          800: '#823c0b',
          900: '#602307',
        },
        parchment: {
          DEFAULT: '#F5EFE0',
          50: '#fdfbf6',
          100: '#F5EFE0',
          200: '#ede3c8',
          300: '#e0d1a8',
          400: '#cdbc84',
          500: '#baa060',
          600: '#BAA060', // Corrected capitalization to match pattern if needed, but not necessary here
        },
        ink: '#333333',
        muted: '#888888',
        success: '#2E7D32',
        alert: '#C62828',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        hero: ['72px', { lineHeight: '1.1', fontWeight: '700' }],
        h1: ['36px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        h3: ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['17px', { lineHeight: '1.7' }],
        sm: ['14px', { lineHeight: '1.6' }],
        caption: ['13px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        card: '0 2px 16px rgba(26,39,68,0.08)',
        'card-hover': '0 8px 32px rgba(26,39,68,0.14)',
        'saffron-glow': '0 0 24px rgba(232,135,42,0.24)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.4s ease forwards',
        'count-up': 'countUp 1s ease forwards',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'parchment-gradient': 'linear-gradient(135deg, #F5EFE0 0%, #EDE3C8 100%)',
        'navy-gradient': 'linear-gradient(135deg, #1A2744 0%, #2b3f6b 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #E8872A 0%, #f0b152 100%)',
        'hero-gradient': 'linear-gradient(160deg, #1A2744 0%, #243356 60%, #1A2744 100%)',
      },
    },
  },
  plugins: [
    typography,
    forms,
  ],
};
