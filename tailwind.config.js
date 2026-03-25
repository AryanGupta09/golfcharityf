/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep navy — primary brand
        navy: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#1e1b4b',
          800: '#16134a',
          900: '#0f0c3d',
        },
        // Warm coral — emotion / CTA
        coral: {
          50:  '#fff5f0',
          100: '#ffe4d6',
          200: '#ffc4a8',
          300: '#ff9d75',
          400: '#ff7043',
          500: '#f4511e',
          600: '#e03e0e',
          700: '#b83008',
          800: '#8c2206',
          900: '#5c1503',
        },
        // Soft ivory — backgrounds
        ivory: {
          50:  '#fdfcf8',
          100: '#faf7f0',
          200: '#f5efe0',
          300: '#ede3c8',
          400: '#dfd0a8',
          500: '#c9b882',
        },
        // Keep dark for dark mode
        dark: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0a0f1a',
        },
        // Aliases for backward compat
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#1e1b4b',
          800: '#16134a',
          900: '#0f0c3d',
        },
        accent: {
          50:  '#fff5f0',
          100: '#ffe4d6',
          200: '#ffc4a8',
          300: '#ff9d75',
          400: '#ff7043',
          500: '#f4511e',
          600: '#e03e0e',
          700: '#b83008',
          800: '#8c2206',
          900: '#5c1503',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'count-up':   'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        countUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      boxShadow: {
        'glow':       '0 0 40px rgba(99,102,241,0.15)',
        'glow-coral': '0 0 40px rgba(244,81,30,0.2)',
        'card':       '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
