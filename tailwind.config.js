/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-teal': '#05352d',
        'turquoise': '#09dac6',
        'teal-light': '#0a4d42',
        'teal-dark': '#021b17',
        'cream-light': '#F7F6F3',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

