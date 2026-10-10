/** @type {import('tailwindcss').Config} */

// Colours come from CSS variables set live by src/theme/dynamicPalette.js,
// so the whole UI re-tints to match the holographic background.
const scale = (name, shades) =>
  Object.fromEntries(shades.map((s) => [s, `hsl(var(--${name}-${s}) / <alpha-value>)`]))

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: scale('brand', SHADES), // primary accent (follows the ink hue)
        glow: scale('glow', SHADES), // secondary accent (hue + 38°)
        gray: scale('gray', [...SHADES, 950]), // text greys, softly tinted by the hue
      },
    },
  },
  plugins: [],
}
