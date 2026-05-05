/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'win-pop': {
          '0%': {transform: 'scale(0.85)'},
          '60%': {transform: 'scale(1.08)'},
          '100%': {transform: 'scale(1)'},
        },
        'dialog-fade-out': {
          'from': {opacity: '1'},
          'to': {opacity: '0'},
        },
        'backdrop-fade-out': {
          'from': {opacity: '0.5'},
          'to': {opacity: '0'},
        },
      },
      animation: {
        'win-pop': 'win-pop 0.6s ease-out',
        'dialog-fade-out': 'dialog-fade-out 500ms ease-in-out forwards',
        'backdrop-fade-out': 'backdrop-fade-out 500ms ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
