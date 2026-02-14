/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Defining a soft dark grey (Material Design style)
        softDark: '#1a1a1a', 
        cardDark: '#242424',
        ringgitGrey: '#BBBCB6', // The color you mentioned
      },
    },
  },
  plugins: [],
};