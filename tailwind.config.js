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
      },
      animation: {
        'win-pop': 'win-pop 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
