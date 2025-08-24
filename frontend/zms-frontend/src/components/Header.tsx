// Header component

export default function Header({
  title,
  subtitle,
  actions,
}: {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    // Add left padding on small screens so the fixed hamburger doesn't overlap the title
    <header className="flex items-start justify-between mb-6 pl-12 md:pl-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="ml-6 flex items-center space-x-4">
        {/* optional actions (e.g. Add Animal) injected by pages; kept right-aligned */}
        {actions}
      </div>
    </header>
  )
}
