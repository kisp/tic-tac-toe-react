/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wood: {
          DEFAULT: '#8B5E3C',
          light: '#A0522D',
          dark: '#5D3A1A',
        },
        cream: {
          DEFAULT: '#FFF8E7',
          dark: '#F5E6C8',
        },
        honey: '#D4A056',
        flame: {
          DEFAULT: '#E8751A',
          dark: '#C86415',
        },
        bark: '#3E2723',
      },
      keyframes: {
        'win-pop': {
          '0%': {transform: 'scale(0.85)'},
          '60%': {transform: 'scale(1.08)'},
          '100%': {transform: 'scale(1)'},
        },
        'dialog-fade-in': {
          from: {opacity: '0'},
          to: {opacity: '1'},
        },
        'dialog-scale-in': {
          '0%': {opacity: '0', transform: 'scale(0.85)'},
          '60%': {opacity: '1', transform: 'scale(1.05)'},
          '100%': {opacity: '1', transform: 'scale(1)'},
        },
        'dialog-fade-out': {
          from: {opacity: '1'},
          to: {opacity: '0'},
        },
        'backdrop-fade-in': {
          from: {opacity: '0'},
          to: {opacity: '0.5'},
        },
        'backdrop-fade-out': {
          from: {opacity: '0.5'},
          to: {opacity: '0'},
        },
      },
      animation: {
        'win-pop': 'win-pop 0.6s ease-out',
        'dialog-fade-in': 'dialog-fade-in 500ms ease-in-out forwards',
        'dialog-scale-in': 'dialog-scale-in 500ms ease-out forwards',
        'dialog-fade-out': 'dialog-fade-out 500ms ease-in-out forwards',
        'backdrop-fade-in': 'backdrop-fade-in 500ms ease-in-out forwards',
        'backdrop-fade-out': 'backdrop-fade-out 500ms ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
