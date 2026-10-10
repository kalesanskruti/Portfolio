import { useState } from 'react'

// Image icon with a letter fallback if the CDN icon fails to load
export default function TechIcon({ src, name, className = 'h-6 w-6' }) {
  const [failed, setFailed] = useState(!src)
  if (failed) {
    return (
      <span
        className={`${className} flex items-center justify-center rounded-md bg-gradient-to-br from-brand-600 to-glow-600 text-xs font-bold text-white`}
      >
        {name.charAt(0)}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      className={`${className} object-contain`}
      onError={() => setFailed(true)}
    />
  )
}
