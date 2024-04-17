export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      colors: {
        fallout: {
          200: 'rgb(255, 239, 192)',
          300: 'rgb(255, 228, 147)',
          500: 'rgb(255, 208, 66)',
        },
      },
      flex: {
        0: '0 0 auto',
      },
    },
  },
  extend: {},
  plugins: [],
};
