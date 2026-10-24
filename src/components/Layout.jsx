import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'
import MiniPlayer from './MiniPlayer.jsx'
import { cariRute } from '../routes.js'

export default function Layout() {
  const { pathname } = useLocation()
  const { showMini, showNav } = cariRute(pathname)
  const tampilkanMiniPlayer = showMini && (pathname === '/' || pathname === '/album' || pathname === '/kejutan')
  const area = useRef(null)

  useEffect(() => {
    area.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div
      className="relative mx-auto flex h-dvh min-h-0 w-full max-w-103 flex-col overflow-hidden font-sans text-cream"
      style={{ background: 'radial-gradient(circle at 20% 0%, rgba(244,182,194,.16), transparent 55%), #1A1216' }}
    >
      {/* padding atas/samping diatur tiap halaman (beda per layar di desain) */}
      <main ref={area} className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
      {tampilkanMiniPlayer && <MiniPlayer />}
      {showNav && <BottomNav />}
    </div>
  )
}
