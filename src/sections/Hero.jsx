import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react'
import TrackingCharacter from '../components/TrackingCharacter'
import { profile } from '../data/portfolio'

const EASE = [0.22, 1, 0.36, 1]
const rise = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
})

export default function Hero() {
  const [first, ...rest] = profile.name.split(' ')

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden md:justify-end">
      {/* subtle glow in the live ink colour behind the character */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[10%] left-1/2 h-[50svh] w-[50svh] -translate-x-1/2 rounded-full bg-brand-500/15 blur-[110px] md:left-[62%]"
      />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 md:left-[62%]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE }}>
          <TrackingCharacter
            alt={`Portrait of ${profile.name} that follows your cursor`}
            className="block h-[50svh] max-w-none md:h-[86svh]"
            style={{ aspectRatio: '882 / 717' }}
          />
        </motion.div>
      </div>

      {/* keeps the copy readable where it overlaps the ink */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-gray-50/80 to-transparent dark:from-[#05060d]/80 md:inset-y-0 md:left-0 md:right-auto md:h-auto md:w-[52%] md:bg-gradient-to-r"
      />

      <div className="relative z-10 px-6 pt-28 md:max-w-[36rem] md:pb-16 md:pl-[6%] md:pt-28">
        <motion.div
          {...rise(0.15)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-900/10 bg-white/40 px-3 py-1.5 text-xs font-medium text-gray-700 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Available for opportunities
        </motion.div>

        <motion.p {...rise(0.25)} className="mt-6 text-xs font-medium uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
          Hi, I&apos;m
        </motion.p>
        <motion.h1 {...rise(0.35)} className="mt-2 leading-[0.92] text-gray-900 dark:text-gray-50">
          <span className="block font-serif text-6xl font-normal italic tracking-normal sm:text-7xl md:text-[5.5rem]">{first}</span>
          <span className="block font-display text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            {rest.join(' ')}
            <span className="gradient-text">.</span>
          </span>
        </motion.h1>

        <motion.p {...rise(0.5)} className="mt-5 font-display text-base font-medium text-gray-800 dark:text-gray-100 sm:text-lg">
          {profile.roles.slice(0, 2).join('  ·  ')}
        </motion.p>
        <motion.p {...rise(0.58)} className="mt-3 max-w-[22rem] text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[0.95rem]">
          {profile.tagline}
        </motion.p>

        <motion.div {...rise(0.7)} className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-gray-900"
          >
            View Résumé
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-gray-900/15 bg-white/30 px-6 py-3 text-sm font-semibold text-gray-900 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/50 dark:border-white/25 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            Let&apos;s Talk
          </a>
        </motion.div>

        <motion.p {...rise(0.8)} className="mt-6 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5" /> Based in {profile.location}
        </motion.p>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 right-6 z-10 hidden items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:flex"
      >
        Scroll <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
      </motion.a>
    </section>
  )
}
