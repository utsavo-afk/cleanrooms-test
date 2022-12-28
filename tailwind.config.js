/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui'],
        paprika: ['Paprika'],
        roundedmplus: ['M PLUS Rounded 1c'],
        ptsans: ['PT sans'],
        inter: ['Inter'],
      },
      colors: {
        login: {
          offWhite: 'rgba(255, 255, 255, 0.58)',
          background: 'rgb(0,123,101)',
        },
        review: {
          light: '#606060',
        },
        restaurant: {
          light: '#F3F3F3',
          primary: '#606060',
          secondary: '#0097EC',
          buttonbg: '#007B65',
        },
        home: {
          bottom: '#64A498',
          primary: '#0097EC',
          gray: '#606060',
          handleBg: '#007B65',
          handle: '#D9D9D9',
          red: '#D32323',
        },
        header: {
          top: '#007B65',
        },
        review: {
          darkGrey: '#303030',
          inputBg: '#F4F4F4',
        },
        ...defaultTheme.colors,
      },
    },

    screens: {
      xs: '376px',
      xxs: '316px',
      ...defaultTheme.screens,
    },
  },
  plugins: [require('daisyui')],
};
