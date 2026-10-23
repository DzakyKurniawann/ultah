import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import content from '../content.js'
import { useAudio } from '../lib/AudioProvider.jsx'
import { sudahLolos, tandaiLolos } from '../lib/gerbang.js'

// rumus bintang dari script 01-gerbang
const BINTANG = Array.from({ length: 30 }, (_, i) => {
  const x = (i * 37 + 11) % 100
  const y = (i * 53 + 7) % 100
  const ukuran = 1 + (i % 3)
  return { left: `${x}%`, top: `${y}%`, width: ukuran, height: ukuran, animationDelay: `${(i % 7) * 0.5}s` }
})

export default function Gerbang() {
  const G = content.gerbang
  const navigate = useNavigate()
  const { play } = useAudio()
  const [awalLolos] = useState(sudahLolos) // dibaca sekali agar layar sambutan tidak terlewat
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('idle') // idle | wrong | ok
  const [tries, setTries] = useState(0)
  const salahTimer = useRef(null)
  const masukTimer = useRef(null)

  useEffect(
    () => () => {
      clearTimeout(salahTimer.current)
      clearTimeout(masukTimer.current)
    },
    [],
  )

  if (awalLolos) return <Navigate to="/" replace />

  const onType = (e) => {
    if (status === 'ok') return
    const v = (e.target.value || '').replace(/\D/g, '').slice(0, 6)
    clearTimeout(salahTimer.current)
    setValue(v)
    setStatus('idle')
    if (v.length !== 6) return
    if (v === content.kodeGerbang) {
      setStatus('ok')
      play() // SINKRON di dalam handler pengguna (kebijakan autoplay Chrome Android)
      tandaiLolos()
      masukTimer.current = setTimeout(() => navigate('/', { replace: true }), 1800)
    } else {
      setTries((t) => t + 1)
      setStatus('wrong')
      salahTimer.current = setTimeout(() => {
        setStatus('idle')
        setValue('')
      }, 1000)
    }
  }

  const pesan = status === 'wrong' ? G.pesanSalah[(tries - 1) % G.pesanSalah.length] : ''

  return (
    <div className="relative h-full overflow-hidden" style={{ background: '#1A1216', color: '#FFF8F5' }}>
      <div className="glow" />
      {BINTANG.map((s, i) => (
        <div key={i} className="star" style={s} />
      ))}

      <div
        style={{
          position: 'relative', height: '100%', boxSizing: 'border-box',
          padding: 'calc(72px + env(safe-area-inset-top,0px)) 32px calc(40px + env(safe-area-inset-bottom,0px))',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#E8A9A0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
        <p style={{ margin: '28px 0 0', fontSize: 14, color: '#F4B6C2' }}>{G.salam}</p>
        <h1 style={{ margin: '14px 0 0', fontFamily: 'Fraunces,serif', fontWeight: 500, fontSize: 36, lineHeight: 1.2 }}>
          {G.judulAwal}{' '}
          <em style={{ fontWeight: 400, color: '#FFD9E0' }}>{G.judulPenekanan}</em>
        </h1>
        <p style={{ margin: '18px 0 0', fontSize: 16, lineHeight: 1.6, color: 'rgba(255,248,245,.78)' }}>{G.subteks}</p>
        <p style={{ margin: '6px 0 0', fontFamily: 'Caveat,cursive', fontSize: 22, color: '#E8A9A0' }}>{G.petunjuk}</p>

        <div className={`pin ${status === 'wrong' ? 'shake' : ''}`} style={{ position: 'relative', marginTop: 36, display: 'flex', gap: 10 }}>
          {Array.from({ length: 6 }, (_, i) => {
            const aktif = i === value.length && status === 'idle'
            return (
              <div
                key={i}
                style={{
                  width: 44, height: 56, boxSizing: 'border-box', borderRadius: 14, background: '#261A21',
                  border: `1.5px solid ${aktif ? '#F4B6C2' : value[i] ? '#E8A9A0' : '#33232C'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Fraunces,serif', fontSize: 26, color: '#FFF8F5',
                }}
              >
                {value[i] || ''}
              </div>
            )
          })}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            maxLength={6}
            aria-label="Enam angka tanggal, format hari bulan tahun"
            value={value}
            onChange={onType}
            readOnly={status === 'ok'}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, border: 0, fontSize: 16, cursor: 'pointer' }}
          />
        </div>

        <p aria-live="polite" style={{ margin: '22px 0 0', minHeight: 52, fontSize: 15, lineHeight: 1.6, color: '#FFD9E0', fontStyle: 'italic' }}>
          {pesan}
        </p>
        <div style={{ flexGrow: 1 }} />
        <svg width="300" height="40" viewBox="0 0 300 40" fill="none" aria-hidden="true">
          <path d="M0 22 Q25 10 50 22 T100 22 T150 22 T200 22 T250 22 T300 22" stroke="#8EC5D1" strokeOpacity=".5" strokeWidth="1.4" />
          <path d="M0 32 Q25 22 50 32 T100 32 T150 32 T200 32 T250 32 T300 32" stroke="#8EC5D1" strokeOpacity=".25" strokeWidth="1.4" />
        </svg>
      </div>

      {status === 'ok' && (
        <div role="status" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="bloom" />
          <div
            className="fadein"
            style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center', padding: 32, color: '#1A1216',
            }}
          >
            <h2 style={{ margin: 0, fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontWeight: 400, fontSize: 40, lineHeight: 1.2 }}>{G.sambutan}</h2>
            <p style={{ margin: '14px 0 0', fontSize: 16 }}>{G.sambutanKecil}</p>
          </div>
        </div>
      )}
    </div>
  )
}
