import { NavLink } from 'react-router-dom'
import { IKON_TAB } from './icons.jsx'
import { RUTE } from '../routes.js'

export default function BottomNav() {
  return (
    <nav
      aria-label="Navigasi utama"
      className="flex border-t border-line bg-surface"
      style={{ padding: '6px 8px calc(6px + env(safe-area-inset-bottom,0px))' }}
    >
      {RUTE.filter((r) => r.tab).map((r) => {
        const Ikon = IKON_TAB[r.ikon]
        return (
          <NavLink
            key={r.path}
            to={r.path}
            end={r.path === '/'}
            className={({ isActive }) =>
              `tab flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-[13px] no-underline ${
                isActive ? 'text-pink-soft' : 'text-text2'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Ikon />
                {r.label}
                {isActive && <span className="block h-1 w-1 rounded-full bg-pink-soft" />}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
