import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HorizontalScroller({ children, resetKey }) {
  const ref = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    if (ref.current) ref.current.scrollLeft = 0
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [resetKey])

  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  const arrow =
    'absolute z-20 rounded-full bg-white/80 p-2 shadow-md transition hover:bg-brand-100 disabled:pointer-events-none disabled:opacity-0 dark:bg-gray-900/80 dark:hover:bg-brand-900/40'

  return (
    <div className="relative flex items-center">
      <button aria-label="Scroll left" className={`${arrow} -left-2 sm:-left-5`} disabled={!canLeft} onClick={() => scroll(-1)}>
        <ChevronLeft className="h-6 w-6 text-brand-600" />
      </button>
      <div
        ref={ref}
        onScroll={update}
        className="hide-scrollbar flex w-full gap-8 overflow-x-auto scroll-smooth px-1 py-4"
      >
        {children}
      </div>
      <button aria-label="Scroll right" className={`${arrow} -right-2 sm:-right-5`} disabled={!canRight} onClick={() => scroll(1)}>
        <ChevronRight className="h-6 w-6 text-brand-600" />
      </button>
    </div>
  )
}
