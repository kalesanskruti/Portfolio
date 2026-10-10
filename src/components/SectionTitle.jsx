export default function SectionTitle({ icon: Icon, children, className = 'mb-12 sm:mb-16' }) {
  return (
    <h2
      className={`flex items-center justify-center gap-3 text-center text-3xl font-bold text-gray-800 dark:text-gray-50 sm:text-4xl ${className}`}
    >
      {children}
      {Icon && (
        <span className="rounded-xl bg-gradient-to-r from-brand-600 to-glow-600 p-2 text-white shadow-lg">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </span>
      )}
    </h2>
  )
}
