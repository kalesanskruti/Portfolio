import { Sparkles } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import TechIcon from '../components/TechIcon'
import { skillCategories } from '../data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <SectionTitle icon={Sparkles}>Skills & Expertise</SectionTitle>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.1}>
              <div className="glass-card group relative h-full overflow-hidden rounded-3xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${cat.glow} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
                />
                <h3 className="mb-6 text-xl font-bold tracking-wide text-gray-800 dark:text-gray-50">{cat.title}</h3>
                <div className="flex flex-wrap gap-4">
                  {cat.skills.map((s) => (
                    <div
                      key={s.name}
                      tabIndex={0}
                      className="group/skill relative flex w-20 cursor-default flex-col items-center rounded-2xl bg-white/70 p-3 shadow-sm transition hover:scale-105 dark:bg-gray-800/60"
                    >
                      <TechIcon src={s.icon} name={s.name} className="h-8 w-8" />
                      <span className="mt-2 whitespace-nowrap text-xs font-medium text-gray-700 dark:text-gray-300">
                        {s.name}
                      </span>
                      {s.level != null && (
                        <span className="pointer-events-none absolute -top-8 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-black/80 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover/skill:opacity-100 group-focus/skill:opacity-100">
                          {s.level}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
