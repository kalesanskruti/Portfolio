import { useState } from 'react'
import { ExternalLink, FolderGit2, Github } from 'lucide-react'
import HorizontalScroller from '../components/HorizontalScroller'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import { projectCategories, projects } from '../data/portfolio'

function ProjectCard({ p }) {
  const iconBtn =
    'rounded-full border border-brand-500/30 bg-white/40 p-2 text-brand-700 backdrop-blur-sm transition-colors hover:bg-brand-100 dark:bg-gray-800/60 dark:text-brand-300 dark:hover:bg-brand-900/40'
  return (
    <div className="glass-card group relative flex w-[300px] min-w-[300px] flex-col overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:w-[320px] sm:min-w-[320px]">
      <div className="relative overflow-hidden">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {p.featured && (
          <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-brand-600 to-glow-600 px-3 py-1 text-xs font-medium text-white">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6 pb-16">
        <h3 className="mb-3 text-xl font-bold text-gray-800 transition-colors group-hover:text-brand-600 dark:text-gray-50 dark:group-hover:text-brand-400">
          {p.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-gray-600 dark:text-gray-400">{p.description}</p>
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        {p.live && (
          <a href={p.live} target="_blank" rel="noreferrer" aria-label={`${p.title} live demo`} className={iconBtn}>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {p.github && (
          <a href={p.github} target="_blank" rel="noreferrer" aria-label={`${p.title} source code`} className={iconBtn}>
            <Github className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function Portfolio() {
  const [category, setCategory] = useState(projectCategories[0].id)
  const visible = projects.filter((p) => p.category === category)

  return (
    <section id="portfolio" className="py-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="hide-scrollbar mb-10 flex justify-start gap-2 overflow-x-auto pb-2 sm:justify-center sm:gap-4">
            {projectCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-medium transition-all duration-300 sm:px-6 ${
                  category === c.id
                    ? `bg-gradient-to-r ${c.active} text-white shadow-lg`
                    : 'bg-white/60 text-gray-700 hover:bg-brand-100 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-brand-900/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <SectionTitle icon={FolderGit2} className="mb-6">
            My Portfolio
          </SectionTitle>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            Here are some of my recent projects that showcase my skills in development, problem solving, and design.
          </p>

          {visible.length ? (
            <HorizontalScroller resetKey={category}>
              {visible.map((p) => (
                <ProjectCard key={p.title} p={p} />
              ))}
            </HorizontalScroller>
          ) : (
            <p className="text-center text-gray-500">Projects coming soon.</p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
