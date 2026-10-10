import { Heart } from 'lucide-react'
import { footer, profile } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200/60 bg-white/40 py-12 text-gray-800 backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:text-gray-50">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-8">
          <h3 className="mb-4 bg-gradient-to-r from-glow-300 via-brand-300 to-brand-400 bg-clip-text text-2xl font-bold text-transparent">
            {profile.name}
          </h3>
          <p className="mx-auto max-w-md text-gray-600 dark:text-gray-400">{footer.tagline}</p>
        </div>

        {footer.stats.length > 0 && (
          <div className="mb-6 flex flex-wrap justify-center gap-4">
            {footer.stats.map((s) => (
              <span key={s.label} className="border-r border-gray-300 pr-4 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400 last:border-none last:pr-0">
                {s.label}:<span className="ml-1 font-semibold text-gray-900 dark:text-gray-50">{s.value}</span>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-white/10 md:flex-row">
          <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> by {profile.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
