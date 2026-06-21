/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brutalist: {
          bg: '#0c0c0c',
          card: '#111111',
          orange: '#3b1676',
          text: '#f0ede6',
          border: '#1e1e1e',
          muted: '#9d9d9d',
          darkMuted: '#696969',
        },
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        'barlow-cond': ['"Barlow Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

