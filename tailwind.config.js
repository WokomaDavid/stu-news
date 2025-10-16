export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // blue-600
        accent: '#7c3aed', // violet-600
        soft: '#f8fafc',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg,#2563eb 0%, #7c3aed 100%)',
      },
    },
  },
  plugins: [],
};
