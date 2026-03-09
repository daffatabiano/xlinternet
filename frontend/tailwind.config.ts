/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        brand: {
          blue:       '#0057B8', // XL Blue
          'blue-light': '#1A73E8',
          'blue-dark':  '#003D82',
          cyan:        '#00B4D8',
          violet:      '#6D28D9',
          green:       '#10B981',
          amber:       '#F59E0B',
          red:         '#EF4444',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dim:     '#F7F9FF',
          muted:   '#EFF3FF',
        },
        neutral: {
          50:  '#F8FAFF',
          100: '#EFF3FF',
          200: '#DDE5F8',
          300: '#B8C8ED',
          400: '#8097CC',
          500: '#5B73AC',
          600: '#3D5490',
          700: '#2B3D71',
          800: '#1A2752',
          900: '#0D1426',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #0057B8 0%, #6D28D9 100%)',
        'gradient-hero':  'linear-gradient(160deg, #F0F4FF 0%, #E8EEFF 40%, #EDE9FF 70%, #F0EBFF 100%)',
        'gradient-dark':  'linear-gradient(135deg, #0A0F1E 0%, #0F1A3A 50%, #140D30 100%)',
      },
      borderRadius: {
        'xl2': '20px',
        'xl3': '24px',
        'xl4': '32px',
      },
      boxShadow: {
        'card':    '0 4px 24px rgba(15,23,60,0.08), 0 1px 4px rgba(15,23,60,0.04)',
        'card-lg': '0 20px 60px rgba(15,23,60,0.12), 0 4px 16px rgba(15,23,60,0.06)',
        'brand':   '0 8px 24px rgba(0,87,184,0.35)',
        'glow':    '0 0 40px rgba(0,87,184,0.25)',
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'blob-drift':'blob-drift 12s ease-in-out infinite alternate',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'shimmer':   'shimmer 2s linear infinite',
        'fade-up':   'fade-up 0.5s ease forwards',
        'slide-in':  'slide-in 0.4s ease forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        'blob-drift': {
          '0%':   { transform: 'translate(0,0) scale(1)' },
          '100%': { transform: 'translate(40px,30px) scale(1.1)' },
        },
        'pulse-dot': {
          '0%,100%': { boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' },
          '50%':     { boxShadow: '0 0 0 6px rgba(16,185,129,0.1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
