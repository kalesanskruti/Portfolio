import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Bot, Send, X } from 'lucide-react'
import {
  achievements,
  certifications,
  chat,
  education,
  experience,
  profile,
  projects,
  skillCategories,
} from '../data/portfolio'

// Simple keyword-based answers built from the portfolio data (no API needed)
function answer(question) {
  const q = question.toLowerCase()
  if (/skill|tech|stack|language/.test(q))
    return skillCategories.map((c) => `${c.title}: ${c.skills.map((s) => s.name).join(', ')}`).join('\n')
  if (/project|work|built|portfolio/.test(q))
    return `Some projects: ${projects.map((p) => p.title).join(', ')}. Check the Portfolio section for details and links.`
  if (/experience|intern|job/.test(q))
    return experience.map((e) => `${e.title} at ${e.org} (${e.period})`).join('\n')
  if (/educat|college|degree|study/.test(q)) return education.map((e) => `${e.title} — ${e.org} (${e.period})`).join('\n')
  if (/achiev|award|hackathon/.test(q)) return achievements.map((a) => a.title).join('\n')
  if (/certif/.test(q)) return certifications.map((c) => c.title).join('\n')
  if (/resume|cv/.test(q)) return `You can open the resume here: ${window.location.origin}${profile.resume}`
  if (/contact|email|reach|hire|phone/.test(q))
    return `Email: ${profile.email}\nPhone: ${profile.phone}\nOr use the contact form at the bottom of the page.`
  if (/hi|hello|hey/.test(q)) return `Hello! 👋 What would you like to know about ${profile.shortName}?`
  return "I'm not sure about that one. Try asking about skills, projects, experience, education, achievements or contact."
}

function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([{ from: 'bot', text: chat.welcome }])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages])

  const send = (text) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { from: 'user', text }, { from: 'bot', text: answer(text) }])
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 z-50 flex h-[460px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900 sm:right-8"
    >
      <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-glow-600 px-4 py-3 text-white">
        <span className="flex items-center gap-2 font-semibold">
          <Bot className="h-5 w-5" /> {chat.botName}
        </span>
        <button onClick={onClose} aria-label="Close chat" className="rounded-full p-1 hover:bg-white/20">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm ${
              m.from === 'bot'
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                : 'ml-auto bg-gradient-to-r from-brand-600 to-glow-600 text-white'
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
        {chat.quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="whitespace-nowrap rounded-full border border-brand-500/40 px-3 py-1 text-xs text-brand-700 hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-brand-900/40"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
        className="flex gap-2 border-t border-gray-200 p-3 dark:border-gray-700"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything…"
          className="flex-1 rounded-full border border-gray-300 bg-transparent px-4 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700"
        />
        <button type="submit" aria-label="Send" className="rounded-full bg-gradient-to-r from-brand-600 to-glow-600 p-2 text-white">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  )
}

export default function FloatingActions() {
  const [chatOpen, setChatOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <AnimatePresence>{chatOpen && <ChatPanel onClose={() => setChatOpen(false)} />}</AnimatePresence>
      <div className="fixed bottom-4 right-4 z-40 flex flex-row gap-4 sm:bottom-8 sm:right-8">
        <button
          onClick={() => setChatOpen((o) => !o)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-glow-600 p-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Bot className="h-6 w-6" />
          <span className="hidden font-semibold sm:inline">Chat with {chat.botName}</span>
        </button>
        <AnimatePresence>
          {showTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="rounded-full bg-gradient-to-r from-brand-600 to-glow-600 p-3 text-white shadow-lg hover:shadow-xl"
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
