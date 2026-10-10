import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ExternalLink, Trophy } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import { achievements, certifications } from '../data/portfolio'

const lists = {
  achievements: { label: 'Achievements', icon: Trophy, items: achievements },
  certifications: { label: 'Certifications', icon: Award, items: certifications },
}

export default function Achievements() {
  const [tab, setTab] = useState('achievements')
  const { items, icon: Icon } = lists[tab]

  return (
    <section id="achievements" className="py-20">
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-4xl">
          <SectionTitle icon={Trophy} className="mb-8">
            Achievements
          </SectionTitle>

          <div className="mb-12 flex justify-center">
            <div className="relative flex rounded-full bg-white/60 p-1 shadow-inner dark:bg-gray-800/60">
              {Object.entries(lists).map(([id, l]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors sm:px-6 ${
                    tab === id ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tab === id && (
                    <motion.span
                      layoutId="ach-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-600 to-glow-600"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <l.icon className="h-4 w-4" /> {l.label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6"
            >
              {items.map((a) => (
                <div
                  key={a.title}
                  className="glass-card flex flex-col items-center gap-4 rounded-2xl p-6 text-center shadow-lg transition hover:-translate-y-1 hover:shadow-2xl sm:flex-row sm:items-start sm:gap-6 sm:text-left"
                >
                  <span className="flex-shrink-0 rounded-xl bg-gradient-to-br from-brand-600 to-glow-600 p-3 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-50">{a.title}</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{a.description}</p>
                    {a.tags?.length > 0 && (
                      <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                        {a.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {a.link && (
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
                    >
                      View <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
