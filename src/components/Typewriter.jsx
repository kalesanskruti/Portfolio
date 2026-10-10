import { useEffect, useState } from 'react'

export default function Typewriter({ words, speed = 90, pause = 1600, className = '' }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let timer
    if (!deleting && text === word) {
      timer = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      setDeleting(false)
      setIndex((i) => i + 1)
    } else {
      timer = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? speed / 2 : speed,
      )
    }
    return () => clearTimeout(timer)
  }, [text, deleting, index, words, speed, pause])

  return (
    <span className={className}>
      {text}
      <span className="caret ml-0.5 text-brand-500">|</span>
    </span>
  )
}
