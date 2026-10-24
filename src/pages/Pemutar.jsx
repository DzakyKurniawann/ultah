import { useEffect, useState } from 'react'
import content from '../content.js'
import FotoLazy from '../components/FotoLazy.jsx'
import { useAudio } from '../lib/AudioContext.js'
import { IkonKembali, IkonPause, IkonPlay } from '../components/icons.jsx'
import { useKembali } from '../lib/useKembali.js'

const formatWaktu = (detik) => {
  if (!Number.isFinite(detik) || detik < 0) return '0:00'
  const menit = Math.floor(detik / 60)
  const sisaDetik = Math.floor(detik % 60)
  return `${menit}:${String(sisaDetik).padStart(2, '0')}`
}

function ambilFavoritAwal() {
  try {
    return window.localStorage.getItem('hadiah-komang-favorit') === 'true'
  } catch {
    return false
  }
}

export default function Pemutar() {
  const kembali = useKembali('/')
  const { playing, currentTime, duration, audioError, toggle, seek, restart, readCurrentTime } = useAudio()
  const [favorit, setFavorit] = useState(ambilFavoritAwal)
  const [barisIndex, setBarisIndex] = useState(0)
  const [displayTime, setDisplayTime] = useState(currentTime)
  const baris = content.lagu.barisPemutar
  const progress = duration > 0 ? Math.min(100, (displayTime / duration) * 100) : 0

  useEffect(() => {
    let frame = 0
    const update = () => {
      setDisplayTime(readCurrentTime())
      if (playing) frame = window.requestAnimationFrame(update)
    }
    frame = window.requestAnimationFrame(update)
    return () => window.cancelAnimationFrame(frame)
  }, [playing, readCurrentTime])

  useEffect(() => {
    let timer = null
    const mulai = () => {
      if (timer !== null || document.hidden) return
      timer = window.setInterval(() => {
        setBarisIndex((index) => (index + 1) % baris.length)
      }, 6000)
    }
    const hentikan = () => {
      if (timer === null) return
      window.clearInterval(timer)
      timer = null
    }
    const saatVisibilitasBerubah = () => {
      if (document.hidden) hentikan()
      else mulai()
    }
    mulai()
    document.addEventListener('visibilitychange', saatVisibilitasBerubah)
    return () => {
      hentikan()
      document.removeEventListener('visibilitychange', saatVisibilitasBerubah)
    }
  }, [baris.length])

  function toggleFavorit() {
    setFavorit((sebelumnya) => {
      const berikutnya = !sebelumnya
      try {
        window.localStorage.setItem('hadiah-komang-favorit', String(berikutnya))
      } catch {
        // Favorit tetap berfungsi untuk sesi ini jika penyimpanan tidak tersedia.
      }
      return berikutnya
    })
  }

  function majuTigaPuluhDetik() {
    if (duration > 0) seek(Math.min(duration, currentTime + 30))
  }

  return (
    <section className="player-screen">
      <header className="player-header">
        <button type="button" className="player-icon-button" aria-label="Kecilkan pemutar" onClick={kembali}>
          <IkonKembali className="-rotate-90" />
        </button>
        <span> {content.pemutar.judul} </span>
        <span className="w-11" aria-hidden="true" />
      </header>

      <div className="player-disc-area">
        <div className={`player-disc ${playing ? 'is-playing' : ''}`} aria-label={playing ? 'Piringan berputar' : 'Piringan berhenti'}>
          <span className="player-grooves" aria-hidden="true" />
          <span className="player-center">
            {content.lagu.foto ? (
              <FotoLazy
                src={content.lagu.foto}
                alt="Foto kita"
                placeholder={content.pemutar.placeholderFoto}
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            ) : (
              <span>{content.pemutar.placeholderFoto}</span>
            )}
          </span>
        </div>
      </div>

      <div className="player-song">
        <div className="min-w-0">
          <h1>{content.lagu.judul}</h1>
          <p>{content.lagu.artis}</p>
        </div>
        <button
          type="button"
          className={`player-favorite ${favorit ? 'is-favorite' : ''}`}
          aria-label={favorit ? content.pemutar.hapusFavorit : content.pemutar.tambahFavorit}
          aria-pressed={favorit}
          onClick={toggleFavorit}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </button>
      </div>

      <div className="player-progress">
        <input
          type="range"
          aria-label="Posisi lagu"
          min="0"
          max={duration || 0}
          step="any"
          value={Math.min(displayTime, duration || displayTime)}
          disabled={!duration}
          onChange={(event) => {
            const nextTime = Number(event.target.value)
            setDisplayTime(nextTime)
            seek(nextTime)
          }}
          style={{ '--progress': `${progress}%` }}
        />
        <div className="player-times">
          <span>{formatWaktu(displayTime)}</span>
          <span>{formatWaktu(duration)}</span>
        </div>
      </div>

      <div className="player-controls">
        <button type="button" className="player-control-button" aria-label={content.pemutar.ulangi} onClick={restart}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" /></svg>
        </button>
        <button type="button" className="player-main-control" aria-label={playing ? 'Jeda Komang' : 'Putar Komang'} onClick={toggle}>
          {playing ? <IkonPause size={28} /> : <IkonPlay size={28} />}
        </button>
        <button type="button" className="player-control-button" aria-label={content.pemutar.maju30} onClick={majuTigaPuluhDetik} disabled={!duration}>
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 9a12 12 0 1 1-2 13M5 5v6h6" /><text x="16" y="20" textAnchor="middle">30</text></svg>
        </button>
      </div>

      <p className="player-poem" aria-live="polite" key={barisIndex}>{baris[barisIndex]}</p>
      {audioError && <p className="player-error" role="status">{content.pemutar.audioTidakTersedia}</p>}
    </section>
  )
}
