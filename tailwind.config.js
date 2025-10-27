/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8e6',
          100: '#d9edbd',
          200: '#bfe291',
          300: '#a3d663',
          400: '#8acc3f',
          500: '#6B8E23',
          600: '#5a7a1e',
          700: '#486619',
          800: '#365114',
          900: '#2D5016',
        },
        secondary: {
          50: '#fefcf3',
          100: '#fdf8e7',
          200: '#faedc2',
          300: '#f7e29e',
          400: '#f1cc55',
          500: '#F4A460',
          600: '#e89346',
          700: '#d47e2d',
          800: '#bf6914',
          900: '#9f5400',
        },
        surface: '#FFFFFF',
        background: '#F5F3EF',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#D32F2F',
        info: '#2196F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}