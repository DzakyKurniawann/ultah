import { NavLink } from 'react-router-dom'

const tabs = [
  { label: 'Kue', to: '/kejutan/kue', end: true },
  { label: 'Buka saat…', to: '/kejutan/buka-saat' },
  { label: 'Tiga tahun', to: '/kejutan/tiga-tahun' },
]

export default function KejutanTabs() {
  return (
    <nav aria-label="Bagian kejutan" className="flex gap-2 px-5 pt-[calc(16px+env(safe-area-inset-top,0px))]">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex min-h-11 flex-1 items-center justify-center rounded-full px-3 text-center text-[13px] font-medium no-underline transition-colors ${
              isActive ? 'bg-pink-soft font-semibold text-bg' : 'border border-line bg-transparent text-cream'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
