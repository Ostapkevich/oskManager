/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      spacing: {
        '181': '740px',
        '250': '1000px',
        '0.5/12': '4.165%',
       '1.5/12':'12.498333',
       '18': '72px'
      },
      flexBasis: {
        '0.5/12': '4.165%',
      
      }
    },
    plugins: [
      require('flowbite/plugin'),
    ],
    darkMode: 'media',
  }
}