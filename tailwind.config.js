/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        poppins:['Poppins','sans-serif']
      },
      colors:{
        loginColor:'#7538fe',
        thanksColor:'#3d467d'
      },
      textColor:{
        nicheColor:'#344097'
      }
    },
  },
  plugins: [],
};