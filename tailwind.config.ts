import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        hiri: {
          purple: '#7C3AED',
          'purple-dark': '#6D28D9',
          blue: '#3B82F6',
          pink: '#EC4899',
          'text-primary': '#1E293B',
          'text-secondary': '#475569',
          'border-color': '#CBD5E1',
          'border-color-light': '#EAECF0',
          'light-purple': '#F3E8FF',
          'lighter-purple': '#E9D5FF',
        },
      },
      backgroundImage: {
        'hiri-gradient': 'linear-gradient(110deg, #7C3AED 0%, #3B82F6 60%, #EC4899 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'hiri-card': '0 4px 12px -1px rgba(0,0,0,0.05), 0 2px 8px -1px rgba(0,0,0,0.03)',
        'hiri-button': '0 8px 16px -4px rgba(124,58,237,0.35), 0 4px 8px -4px rgba(124,58,237,0.25)',
      },
      animation: {
        'pulse-light': 'pulse-light 1.5s infinite',
        'fade-in-modal': 'fadeInModal 0.3s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in-from-top': 'slideInFromTop 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        'pulse-light': {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.7' },
          '100%': { opacity: '1' },
        },
        'fadeInModal': {
          'from': { opacity: '0', transform: 'translateY(-25px) scale(0.98)' },
          'to': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(124, 58, 237, 0.6)' },
        },
        'slideInFromTop': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scaleIn': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};

export default config; 