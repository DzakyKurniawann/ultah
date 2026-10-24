import { Link } from 'react-router-dom'
import content from '../content.js'
import { useAudio } from '../lib/AudioContext.js'
import { IkonPause, IkonPlay } from './icons.jsx'

export default function MiniPlayer() {
  const { playing, currentTime, duration, toggle } = useAudio()
  const { judul, artis } = content.lagu
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0

  return (
    <div className="mx-3 mb-2 flex items-center gap-3 rounded-[14px] bg-surface-2 px-3 py-2 shadow-[0_6px_16px_rgba(0,0,0,.35)]">
      <Link to="/pemutar" aria-label="Buka pemutar penuh" className="flex min-w-0 flex-1 items-center gap-3 text-left text-cream no-underline">
        <span
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-full ${playing ? 'spin' : ''}`}
          style={{ background: 'conic-gradient(#F4B6C2,#E8A9A0,#FFD9E0,#F4B6C2)' }}
        >
          <span className="block h-3 w-3 rounded-full bg-surface-2" />
        </span>
        <span className="block min-w-0 flex-1">
          <span className="block text-[16px] font-semibold">{judul}</span>
          <span className="block text-[13px] text-text2">{artis}</span>
          <span className="mt-1.5 block h-0.75 rounded-xs" style={{ background: 'rgba(255,248,245,.18)' }}>
            <span className="block h-0.75 rounded-xs bg-pink-soft transition-[width] duration-300 ease-linear" style={{ width: `${pct}%` }} />
          </span>
        </span>
      </Link>
      <button
        type="button"
        aria-label={playing ? `Jeda ${judul}` : `Putar ${judul}`}
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        className="flex h-11 w-11 flex-none items-center justify-center rounded-full border-0 bg-pink-soft text-bg"
      >
        {playing ? <IkonPause /> : <IkonPlay />}
      </button>
    </div>
  )
}
