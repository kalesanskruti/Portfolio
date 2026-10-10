import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, Calendar, ChevronDown, GraduationCap, MapPin } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import { education, experience } from '../data/portfolio'

function TimelineItem({ item, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="relative pb-12 pl-16 last:pb-0 sm:pl-20">
      <div className="absolute left-4 top-1.5 h-4 w-4 rounded-full border-4 border-white bg-gradient-to-r from-brand-600 to-glow-600 dark:border-gray-900 sm:left-6" />
      <div className="glass-card rounded-2xl p-5 shadow-lg sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="mb-1 text-lg font-bold text-gray-800 dark:text-gray-50 sm:text-xl">{item.title}</h4>
              <p className="font-medium text-brand-600 dark:text-brand-400">{item.org}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-500 dark:text-gray-400 sm:items-end">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {item.period}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {item.location}
              </span>
            </div>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Collapse details' : 'Expand details'}
            aria-expanded={open}
            className="rounded-full p-2 transition hover:bg-brand-100 dark:hover:bg-brand-900/40"
          >
            <ChevronDown className={`h-6 w-6 text-brand-600 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              {item.points.map((pt, i) => (
                <li key={i} className={`flex items-start gap-3 text-gray-600 dark:text-gray-300 ${i === 0 ? 'mt-4' : ''}`}>
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-brand-600" />
                  {pt}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const tabs = [
  { id: 'experience', label: 'Experience', heading: 'Professional Experience', icon: Briefcase, items: experience },
  { id: 'education', label: 'Education', heading: 'Education', icon: GraduationCap, items: education },
]

export default function Experience() {
  const [tab, setTab] = useState('experience')
  const current = tabs.find((t) => t.id === tab)

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <SectionTitle icon={Briefcase} className="mb-8">
            Experience & Education
          </SectionTitle>
          <div className="mb-12 flex justify-center gap-4">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 font-medium transition-all duration-300 sm:px-6 ${
                  tab === t.id
                    ? 'bg-gradient-to-r from-brand-600 to-glow-600 text-white shadow-lg'
                    : 'bg-white/60 text-gray-700 hover:bg-brand-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-brand-900/40'
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          <div className="mx-auto max-w-4xl">
            <h3 className="mb-8 text-center text-2xl font-bold text-gray-800 dark:text-gray-50">{current.heading}</h3>
            <div className="relative" key={tab}>
              <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-gradient-to-b from-brand-600 to-glow-600 sm:left-8" />
              {current.items.map((item, i) => (
                <TimelineItem key={item.title + item.org} item={item} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
