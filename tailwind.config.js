/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        waitly: {
          primary: {
            DEFAULT: '#2563eb',
            hover: '#1d4ed8',
            light: '#dbeafe',
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
          neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          },
          success: '#059669',
          error: '#dc2626',
          warning: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'waitly-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'waitly-base': ['1rem', { lineHeight: '1.5rem' }],
        'waitly-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'waitly-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'waitly-2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      spacing: {
        'waitly-xs': '0.5rem',
        'waitly-sm': '0.75rem',
        'waitly-md': '1rem',
        'waitly-lg': '1.5rem',
        'waitly-xl': '2rem',
        'waitly-2xl': '2.5rem',
      },
      borderRadius: {
        'waitly-sm': '0.375rem',
        'waitly-md': '0.5rem',
        'waitly-lg': '0.75rem',
      },
      boxShadow: {
        'waitly-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'waitly-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'waitly-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
}