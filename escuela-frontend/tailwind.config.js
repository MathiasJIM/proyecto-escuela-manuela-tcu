/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3A4776',
        secondary: '#F04438',
        'primary-dark': '#182645',
        'secondary-dark': '#BF3B3C',
        'text-primary': '#535353',
      },
      maxWidth: {
        container: '1440px',
      },
      height: {
        navbar: '120px',
      },
    },
  },
  plugins: [],
}
