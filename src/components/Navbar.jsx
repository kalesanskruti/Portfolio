import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { navLinks, profile } from '../data/portfolio'
import useActiveSection from '../hooks/useActiveSection'
import useTheme from '../hooks/useTheme'

const ids = navLinks.map((l) => l.id)

export default function Navbar() {
  const active = useActiveSection(ids)
  const [dark, toggleTheme] = useTheme()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled ? 'glass-card shadow-lg' : 'bg-white/30 backdrop-blur-md dark:bg-gray-900/30'
        }`}
      >
        <a href="#home" className="gradient-text text-lg font-bold sm:text-xl">
          {profile.name}
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active === l.id
                    ? 'text-brand-600 dark:text-glow-400'
                    : 'text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-glow-400'
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-brand-600 to-glow-600 transition-transform duration-300 ${
                    active === l.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-yellow-500 transition hover:bg-brand-100 dark:hover:bg-brand-900/40"
          >
            {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 text-brand-600" />}
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="rounded-full p-2 text-gray-700 transition hover:bg-brand-100 dark:text-gray-200 dark:hover:bg-brand-900/40 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="glass-card mx-auto mt-2 flex max-w-6xl flex-col rounded-2xl p-2 shadow-lg lg:hidden">
          {navLinks.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                  active === l.id
                    ? 'bg-gradient-to-r from-brand-600 to-glow-600 text-white'
                    : 'text-gray-700 hover:bg-brand-100 dark:text-gray-200 dark:hover:bg-brand-900/40'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
