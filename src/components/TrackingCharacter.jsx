import { useEffect, useRef } from 'react'

// Cursor-tracking character.
//
// Frames were pre-extracted from the animation video
// (scripts/extract-hero-frames.py), each labelled with the direction the
// character looks in. The head moves ALONG that recorded turning path: the
// cursor's angle is smoothed with a shortest-path angular lerp and mapped to
// the nearest frame on the path, so every in-between frame is shown and the
// motion stays continuous. Frames are pre-decoded to ImageBitmaps (no decode
// hitches) and exactly ONE crisp frame is drawn — no blending, no ghosting —
// and only when the frame actually changes.

const ANGLE_RESPONSE = 20 // how fast the head turns towards the cursor (per second)
const MAG_RESPONSE = 18 // how fast it moves between eye contact and turned
const EYE_CONTACT = 0.11 // cursor within this fraction of the viewport from the face → look at the visitor
const ENTER_TURN = 0.2 // look strength needed to leave eye contact…
const EXIT_TURN = 0.14 // …and to return to it (hysteresis)
const FACE = { x: 0.55, y: 0.31 } // face position inside the frame (fractions)
const REACH = { x: 0.4, y: 0.42 } // viewport fraction from the face that maps to a full head turn
const IDLE_AFTER = 4000 // ms without pointer input before she looks around on her own
const BOTTOM_FADE = 0.2 // fraction of the frame height that fades out at the bottom
const SIDE_FADE = 0.08 // fraction of the width that fades out at each side (hides the jacket crop)

const TAU = Math.PI * 2
const angleDelta = (from, to) => ((((to - from) % TAU) + TAU + Math.PI) % TAU) - Math.PI

export default function TrackingCharacter({ dir = '/hero/frames/', alt = '', className = '', style }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = {
      ring: [], // turned frames sorted by angle
      center: null,
      shown: null, // frame currently on screen
      angle: 0, // smoothed look angle
      mag: 0, // smoothed look strength
      turned: false,
      target: { angle: 0, mag: 0 },
      lastPointer: -Infinity,
      srcW: 0,
      raf: 0,
      visible: true,
      last: performance.now(),
    }
    let disposed = false

    const paint = () => {
      const { width: w, height: h } = canvas
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, w, h)
      ctx.imageSmoothingQuality = 'high' // (reset whenever the canvas is resized)
      ctx.drawImage(s.shown.bmp, 0, 0, w, h)
      // soft fade into the page at the bottom (cheaper than a CSS mask)
      const g = ctx.createLinearGradient(0, h * (1 - BOTTOM_FADE), 0, h)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = g
      ctx.fillRect(0, h * (1 - BOTTOM_FADE), w, h * BOTTOM_FADE)
      const sw = w * SIDE_FADE
      const l = ctx.createLinearGradient(0, 0, sw, 0)
      l.addColorStop(0, 'rgba(0,0,0,1)')
      l.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = l
      ctx.fillRect(0, 0, sw, h)
      const r = ctx.createLinearGradient(w - sw, 0, w, 0)
      r.addColorStop(0, 'rgba(0,0,0,0)')
      r.addColorStop(1, 'rgba(0,0,0,1)')
      ctx.fillStyle = r
      ctx.fillRect(w - sw, 0, sw, h)
      ctx.globalCompositeOperation = 'source-over'
    }

    const show = (frame) => {
      if (!frame?.bmp || frame === s.shown) return
      s.shown = frame
      paint()
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      // never render above the source resolution — no visible gain, much more work
      const scale = s.srcW ? Math.min(dpr, s.srcW / r.width) : dpr
      canvas.width = Math.max(1, Math.round(r.width * scale))
      canvas.height = Math.max(1, Math.round(r.height * scale))
      if (s.shown) paint()
    }

    const nearestOnPath = (angle) => {
      let best = null
      let bestD = Infinity
      for (const f of s.ring) {
        if (!f.bmp) continue
        const d = Math.abs(angleDelta(f.angle, angle))
        if (d < bestD) {
          bestD = d
          best = f
        }
      }
      return best
    }

    const onPointer = (e) => {
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - (r.left + r.width * FACE.x)
      const py = r.top + r.height * FACE.y - e.clientY
      s.lastPointer = performance.now()
      if (Math.hypot(px, py) < EYE_CONTACT * Math.min(window.innerWidth, window.innerHeight)) {
        s.target.mag = 0
        return
      }
      const x = px / (window.innerWidth * REACH.x)
      const y = py / (window.innerHeight * REACH.y)
      s.target.angle = Math.atan2(y, x)
      s.target.mag = Math.min(1, Math.hypot(x, y))
    }

    const loop = (now) => {
      const dt = Math.min(0.1, (now - s.last) / 1000)
      s.last = now
      if (now - s.lastPointer > IDLE_AFTER) {
        // slow, natural look-around that keeps returning to eye contact
        const t = now / 1000
        const k = Math.max(0, Math.sin(t * 0.22))
        s.target.angle = Math.atan2(0.45 * Math.sin(t * 0.6 + 1), 0.8 * Math.sin(t * 0.35))
        s.target.mag = 0.75 * k
      }
      // shortest-path angular lerp + magnitude lerp (frame-rate independent)
      s.angle += angleDelta(s.angle, s.target.angle) * (1 - Math.exp(-dt * ANGLE_RESPONSE))
      s.mag += (s.target.mag - s.mag) * (1 - Math.exp(-dt * MAG_RESPONSE))
      if (s.turned ? s.mag < EXIT_TURN : s.mag > ENTER_TURN) s.turned = !s.turned

      show(s.turned ? nearestOnPath(s.angle) || s.center : s.center)
      s.raf = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(s.raf)
      if (!reduceMotion && s.visible && !document.hidden && s.center?.bmp) {
        s.last = performance.now()
        s.raf = requestAnimationFrame(loop)
      }
    }

    const decode = async (frame) => {
      try {
        const res = await fetch(dir + frame.src)
        frame.bmp = await createImageBitmap(await res.blob())
      } catch {
        /* skip frames that fail; the path just has a small gap */
      }
    }

    fetch(dir + 'manifest.json')
      .then((r) => r.json())
      .then(async (m) => {
        if (disposed) return
        s.srcW = m.width
        const frames = m.frames.map((f) => ({ ...f, angle: Math.atan2(f.y, f.x), mag: Math.hypot(f.x, f.y) }))
        s.center = frames.find((f) => f.src === m.center) || frames[0]
        s.ring = frames.filter((f) => f.mag >= 0.3).sort((a, b) => a.angle - b.angle)

        await decode(s.center) // eye contact first…
        if (disposed || !s.center.bmp) return
        s.shown = s.center
        resize()
        start()
        if (reduceMotion) return
        // …then the turning path, a few at a time
        const queue = [...s.ring]
        const worker = async () => {
          while (queue.length && !disposed) await decode(queue.shift())
        }
        await Promise.all([worker(), worker(), worker(), worker()])
      })
      .catch((err) => console.error('Character frames failed to load:', err))

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting
      start()
    })
    io.observe(canvas)
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', start)

    return () => {
      disposed = true
      cancelAnimationFrame(s.raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', start)
      ;[s.center, ...s.ring].forEach((f) => f?.bmp?.close?.())
    }
  }, [dir])

  return <canvas ref={canvasRef} role="img" aria-label={alt} className={className} style={style} />
}
