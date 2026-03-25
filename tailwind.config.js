/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#020617',
          secondary: '#0f172a',
        },
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
        '5xl': '40px',
      },
      animation: {
        'holographic': 'holographic 4s ease-in-out infinite',
      },
      keyframes: {
        holographic: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
}
