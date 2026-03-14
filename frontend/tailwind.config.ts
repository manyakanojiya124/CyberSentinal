import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-purple': '#b980ff',
        'neon-gold': '#ffce3d',
        'neon-green': '#39ff14',
        'dark-bg': '#0d0d0d',
      },
      fontFamily: {
        techno: ['"Orbitron"', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
export default config
