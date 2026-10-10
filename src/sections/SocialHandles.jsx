import { Share2 } from 'lucide-react'
import HorizontalScroller from '../components/HorizontalScroller'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import TechIcon from '../components/TechIcon'
import { socials } from '../data/portfolio'

export default function SocialHandles() {
  return (
    <section id="social-handles" className="py-20">
      <div className="container mx-auto px-6">
        <Reveal>
          <SectionTitle icon={Share2} className="mb-10">
            Social Handles
          </SectionTitle>
          <HorizontalScroller>
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="glass-card group flex min-w-[220px] flex-col items-center justify-center rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/20"
              >
                <span className="mb-4 rounded-2xl bg-white p-3 shadow-md transition-transform group-hover:scale-110">
                  <TechIcon src={s.icon} name={s.name} className="h-12 w-12 sm:h-14 sm:w-14" />
                </span>
                <span className="mb-1 text-xl font-semibold text-gray-800 dark:text-gray-50">{s.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Visit my {s.name} profile</span>
              </a>
            ))}
          </HorizontalScroller>
        </Reveal>
      </div>
    </section>
  )
}
