/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        navbarColor:"#374151",
        bodyColor:"#E5E7EB"
      }
    },
  },
  plugins: [],
}