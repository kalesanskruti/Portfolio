import { useEffect, useRef } from 'react'

// Glowing cursor dot + trailing aura ring that grows over interactive elements.
// Only on devices with a precise pointer; respects reduced motion.
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')
    const dot = dotRef.current
    const ring = ringRef.current
    let x = -100
    let y = -100
    let rx = x
    let ry = y
    let scale = 1
    let hover = false
    let raf = 0

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      hover = !!e.target.closest?.(INTERACTIVE)
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      dot.style.opacity = ring.style.opacity = '1'
    }
    const onLeave = () => (dot.style.opacity = ring.style.opacity = '0')
    const onDown = () => (scale = 0.8)
    const onUp = () => (scale = 1)

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      const s = (hover ? 1.9 : 1) * scale
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${s})`
      ring.dataset.hover = hover
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div
        ref={dotRef}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-white opacity-0 shadow-[0_0_12px_3px_hsl(var(--brand-400)/0.8)]"
      />
      <div
        ref={ringRef}
        className="absolute -ml-5 -mt-5 h-10 w-10 rounded-full border border-white/50 opacity-0 transition-[background-color,border-color] duration-200 data-[hover=true]:border-brand-300/80 data-[hover=true]:bg-brand-400/10"
        style={{ boxShadow: '0 0 24px hsl(var(--brand-400) / 0.35)' }}
      />
    </div>
  )
}
