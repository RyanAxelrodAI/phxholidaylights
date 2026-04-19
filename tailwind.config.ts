import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        holiday: {
          green: '#1a5c2a',
          'green-dark': '#0d2e15',
          'green-light': '#2d7a40',
          red: '#c0392b',
          'red-light': '#e74c3c',
          gold: '#f0b429',
          dark: '#0a1a0c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
