import { useState } from 'react'
import { UserRound } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import TechIcon from '../components/TechIcon'
import Typewriter from '../components/Typewriter'
import { about, profile, techStack } from '../data/portfolio'

export default function About() {
  const [showPhoto, setShowPhoto] = useState(false)

  return (
    <section id="about" className="overflow-hidden py-20">
      <div className="container mx-auto px-6">
        <Reveal className="mx-auto max-w-5xl">
          <SectionTitle icon={UserRound}>About Me</SectionTitle>

          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-600 to-glow-600 opacity-40 blur-xl" />
                <img
                  src={showPhoto ? about.photo : about.illustration}
                  alt={profile.name}
                  className="relative aspect-square w-full rounded-2xl object-cover shadow-2xl"
                />
              </div>
              <div className="rounded-xl bg-brand-100 px-4 py-2 font-mono font-semibold text-brand-800 dark:bg-brand-900/60 dark:text-brand-200">
                <Typewriter words={about.greetings} />
              </div>
              <button onClick={() => setShowPhoto((s) => !s)} className="btn-gradient px-5 py-2 text-sm">
                {showPhoto ? 'Show Avatar' : 'Show Original'}
              </button>
            </div>

            <div className="space-y-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              {about.paragraphs.map((p, i) => (
                <p key={i} className="text-justify">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <h3 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-50">Known Technologies & Tech Stack</h3>
        <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track gap-6">
            {[...techStack, ...techStack].map((t, i) => (
              <div
                key={i}
                className="flex h-24 min-w-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/70 shadow-sm dark:border-gray-800 dark:bg-[#181c2a]/80"
              >
                <TechIcon src={t.icon} name={t.name} className="h-9 w-9" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
