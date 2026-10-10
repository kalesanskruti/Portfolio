import { useState } from 'react'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import TechIcon from '../components/TechIcon'
import { contact, profile, socials } from '../data/portfolio'

const empty = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState({ type: 'idle', text: '' })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!contact.formspreeId) {
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${body}`
      return
    }
    setStatus({ type: 'sending', text: 'Sending…' })
    try {
      const res = await fetch(`https://formspree.io/f/${contact.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setForm(empty)
      setStatus({ type: 'ok', text: 'Thanks! Your message has been sent.' })
    } catch {
      setStatus({ type: 'error', text: 'Something went wrong. Please email me directly.' })
    }
  }

  const info = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: Phone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, '')}` },
    { icon: MapPin, label: 'Location', value: profile.location },
  ]
  const input =
    'w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-3 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-50'

  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-brand-400/30 to-glow-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-glow-400/20 to-brand-400/20 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6">
        <Reveal>
          <SectionTitle icon={Mail} className="mb-6">
            {contact.heading}
          </SectionTitle>
          <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300">{contact.subheading}</p>

          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div className="space-y-10">
              <div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-50">Let&apos;s Connect</h3>
                <p className="text-gray-600 dark:text-gray-400">{contact.blurb}</p>
              </div>

              <div className="space-y-4">
                {info.map(({ icon: Icon, label, value, href }) => {
                  const Tag = href ? 'a' : 'div'
                  return (
                    <Tag
                      key={label}
                      href={href}
                      className="flex items-center gap-4 rounded-xl border border-white/30 bg-white/70 p-4 shadow-md backdrop-blur-md transition hover:-translate-y-0.5 dark:border-gray-700/30 dark:bg-gray-800/70"
                    >
                      <span className="rounded-lg bg-gradient-to-r from-brand-600 to-glow-600 p-3 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">{label}</span>
                        <span className="font-medium text-gray-800 dark:text-gray-50">{value}</span>
                      </span>
                    </Tag>
                  )
                })}
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-50">Follow Me</h4>
                <div className="flex gap-4">
                  {socials
                    .filter((s) => s.follow)
                    .map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.name}
                        className="rounded-full bg-white p-3 shadow-md transition hover:scale-110"
                      >
                        <TechIcon src={s.icon} name={s.name} className="h-6 w-6" />
                      </a>
                    ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/30 bg-white/80 p-6 shadow-2xl backdrop-blur-md dark:border-gray-700/30 dark:bg-gray-900/80 sm:p-8">
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
                    <input name="name" required value={form.name} onChange={update} className={input} placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={update}
                      className={input}
                      placeholder="you@example.com"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</span>
                  <input name="subject" required value={form.subject} onChange={update} className={input} placeholder="What's this about?" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={update}
                    className={`${input} resize-none`}
                    placeholder="Tell me about your project or opportunity…"
                  />
                </label>
                <button type="submit" disabled={status.type === 'sending'} className="btn-gradient w-full disabled:opacity-60">
                  <Send className="h-5 w-5" /> Send Message
                </button>
                {status.text && (
                  <p className={`text-center text-sm ${status.type === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
                    {status.text}
                  </p>
                )}
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
