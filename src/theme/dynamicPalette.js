// Live colour engine: derives every UI colour from one hue so text, buttons
// and gradients always match the hue the holographic ink is showing.
//
// Colours are written as CSS variables ("H S% L%") consumed by Tailwind
// (see tailwind.config.js), e.g. bg-brand-500 -> hsl(var(--brand-500)).

// Must match the shader in HolographicBackground.jsx
export const HUE_SPEED = 0.015 // palette cycles per second (~67s per full loop)
export const HUE_OFFSET = 0.15 // average spatial hue offset of the ink

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const BRAND_L = [96, 91, 83, 75, 67, 59, 51, 44, 36, 28]
const GRAY_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
const GRAY_L = [97, 93, 86, 78, 66, 53, 41, 31, 19, 11, 6]

// Same cosine palette as the shader: .5 + .5*cos(2π(h + [0,.33,.67]))
function inkRgb(h) {
  return [0, 0.33, 0.67].map((o) => 0.5 + 0.5 * Math.cos(2 * Math.PI * (h + o)))
}

function rgbToHue([r, g, b]) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return 0
  let h
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  return (h * 60 + 360) % 360
}

/** Hue (degrees) the ink is showing at `time` seconds. */
export function inkHueAt(time) {
  const h = time * HUE_SPEED + HUE_OFFSET
  return rgbToHue(inkRgb(h - Math.floor(h)))
}

// Relative luminance (WCAG) of an HSL colour
function luminance(h, s, l) {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const ch = (n) => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * ch(0) + 0.7152 * ch(8) + 0.0722 * ch(4)
}

// Yellow/green/cyan are far brighter than blue/violet at the same HSL lightness.
// Clamp each shade's luminance so contrast stays consistent for every hue:
// dark shades (button fills) stay readable under white text, light shades
// (text on the dark ink) stay bright enough to read.
const MAX_LUM = { 500: 0.24, 600: 0.17, 700: 0.11, 800: 0.07, 900: 0.045 }
const MIN_LUM = { 200: 0.5, 300: 0.36, 400: 0.24 }

function shade(hue, step, lightness, saturation) {
  let l = lightness
  const max = MAX_LUM[step]
  const min = MIN_LUM[step]
  if (max !== undefined && luminance(hue, saturation, l) > max) {
    let lo = 5
    let hi = l
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2
      if (luminance(hue, saturation, mid) > max) hi = mid
      else lo = mid
    }
    l = lo
  } else if (min !== undefined && luminance(hue, saturation, l) < min) {
    let lo = l
    let hi = 97
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2
      if (luminance(hue, saturation, mid) < min) lo = mid
      else hi = mid
    }
    l = hi
  }
  return `${hue.toFixed(1)} ${saturation}% ${l.toFixed(1)}%`
}

let lastHue = null

/** Write the full palette for a hue onto :root. Skips tiny changes. */
export function applyPalette(hue, force = false) {
  if (!force && lastHue !== null) {
    const diff = Math.abs(((hue - lastHue + 540) % 360) - 180)
    if (diff < 2) return // invisible steps aren't worth a page-wide style update
  }
  lastHue = hue
  const style = document.documentElement.style
  const glowHue = (hue + 38) % 360
  SHADES.forEach((s, i) => {
    style.setProperty(`--brand-${s}`, shade(hue, s, BRAND_L[i], 88))
    style.setProperty(`--glow-${s}`, shade(glowHue, s, BRAND_L[i], 90))
  })
  GRAY_SHADES.forEach((s, i) => {
    style.setProperty(`--gray-${s}`, `${hue.toFixed(1)} ${s >= 800 ? 30 : 24}% ${GRAY_L[i]}%`)
  })
}
