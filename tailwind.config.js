/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#fdf8f0', 100: '#f9ecd8', 200: '#f0d5a8', 300: '#e8c88a',
          400: '#d4a94e', 500: '#C8963E', 600: '#b07e2e', 700: '#8a6324',
          800: '#6b4d1c', 900: '#4d3714', 950: '#2e210c',
        },
        fuseau: {
          navy: '#0F172A', 'navy-deep': '#080E1A', 'navy-light': '#1E293B',
          gold: '#C8963E', 'gold-light': '#E8C88A', 'gold-dim': '#A07830',
          primary: '#1E3A8A', 'primary-light': '#2563EB',
          accent: '#F97316', 'accent-hover': '#EA580C',
          success: '#059669', warning: '#D97706', danger: '#DC2626',
        },
        surface: { DEFAULT: '#F5F6FA', card: '#FFFFFF', hover: '#F0F1F5' },
        slate: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
          400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
          800: '#1e293b', 900: '#0f172a', 950: '#020617',
        },
        ai: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6',
          600: '#0d9488',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15,23,42,0.06), 0 4px 16px rgba(15,23,42,0.04)',
        'card-hover': '0 4px 12px rgba(15,23,42,0.08), 0 8px 24px rgba(15,23,42,0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.25s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { 'background-position': '-200% 0' }, '100%': { 'background-position': '200% 0' } },
      },
    }
  },
  safelist: [
    ...['blue', 'red', 'purple', 'orange', 'yellow', 'pink', 'green', 'indigo', 'amber', 'emerald', 'teal', 'slate'].flatMap(color => [
      `bg-${color}-50`, `bg-${color}-100`, `bg-${color}-500`, `bg-${color}-600`,
      `text-${color}-500`, `text-${color}-600`, `text-${color}-700`,
      `border-${color}-200`, `border-${color}-300`, `border-${color}-500`,
    ]),
  ],
  plugins: []
};
