import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import KejutanTabs from '../components/KejutanTabs.jsx'
import content from '../content.js'

function KueIlustrasi({ padam, onTiup }) {
  return (
    <div className={`cake-scene ${padam ? 'is-dimmed' : ''}`}>
      <div className="cake-glow" />
      <svg viewBox="0 -20 280 280" className="block h-full w-full" role="img" aria-label={`Kue ulang tahun dengan lilin angka ${content.usia}`}>
        <ellipse cx="140" cy="236" rx="124" ry="14" fill="#33232C" />
        <ellipse cx="140" cy="232" rx="118" ry="13" fill="#FFF8F5" />
        <ellipse cx="140" cy="230" rx="104" ry="9" fill="#FFD9E0" />
        <rect x="40" y="152" width="200" height="76" rx="14" fill="#FFF8F5" />
        <path d="M40 190h200v24a14 14 0 0 1-14 14H54a14 14 0 0 1-14-14v-24Z" fill="#F4B6C2" />
        {Array.from({ length: 9 }, (_, i) => <circle key={`icing-${i}`} cx={54 + i * 22} cy="154" r="7" fill="#FFF8F5" />)}
        {Array.from({ length: 11 }, (_, i) => <circle key={`sprinkle-${i}`} cx={56 + i * 16} cy="214" r="2.4" fill="#FFF8F5" />)}
        <rect x="70" y="102" width="140" height="58" rx="12" fill="#FFD9E0" />
        <rect x="70" y="126" width="140" height="34" rx="10" fill="#FFF8F5" />
        {Array.from({ length: 9 }, (_, i) => <circle key={`top-${i}`} cx={82 + i * 14} cy="144" r="2.2" fill="#F4B6C2" />)}
        <text x="108" y="102" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="500" fontSize="50" fill="#F4B6C2">{String(content.usia).padStart(2, '0')[0]}</text>
        <text x="152" y="102" textAnchor="middle" fontFamily="Fraunces, serif" fontWeight="500" fontSize="50" fill="#FFF8F5">{String(content.usia).padStart(2, '0').slice(1)}</text>
        {[108, 152].map((x, index) => (
          <g key={x} transform={`translate(${x} 62)`}>
            <path d="M0 0v5" stroke="#1A1216" strokeOpacity=".5" strokeWidth="1.5" />
            {padam && <path className="cake-smoke" d="M0-3c-8-8 7-10 0-19s6-8 0-15" />}
            <g className={`cake-flame ${padam ? 'is-out' : ''}`} style={{ animationDelay: `${index * 120}ms` }}>
              <path d="M0 0C-7-9-6-17 0-26C6-17 7-9 0 0Z" fill="#F4B6C2" />
              <path d="M0-2C-3-7-3-12 0-17C3-12 3-7 0-2Z" fill="#FFF8F5" />
            </g>
          </g>
        ))}
      </svg>
      {!padam && (
        <button
          type="button"
          aria-label="Tiup lilin"
          className="absolute inset-0 h-full w-full border-0 bg-transparent"
          onClick={onTiup}
        />
      )}
    </div>
  )
}

export default function Kue() {
  const [stage, setStage] = useState('sebelum')
  const [micLoading, setMicLoading] = useState(false)
  const micRef = useRef({ stream: null, context: null, frame: null })
  const micAttemptRef = useRef(false)
  const mountedRef = useRef(true)
  const stageRef = useRef(stage)
  const kue = content.kue

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  const hentikanMikrofon = useCallback(() => {
    const mic = micRef.current
    if (mic.frame !== null) window.cancelAnimationFrame(mic.frame)
    mic.frame = null
    mic.stream?.getTracks().forEach((track) => track.stop())
    mic.stream = null
    if (mic.context && mic.context.state !== 'closed') {
      void mic.context.close().catch(() => {})
    }
    mic.context = null
  }, [])

  const tiupLilin = useCallback(() => {
    if (stageRef.current !== 'sebelum') return
    stageRef.current = 'padam'
    hentikanMikrofon()
    setStage('padam')
  }, [hentikanMikrofon])

  useEffect(() => {
    if (stage !== 'padam') return undefined
    const timer = window.setTimeout(() => setStage('perayaan'), 2200)
    return () => window.clearTimeout(timer)
  }, [stage])

  useEffect(() => {
    if (stage !== 'perayaan') return undefined
    let cancelled = false
    let confettiModule
    const resetWhenHidden = () => {
      if (document.hidden) confettiModule?.reset()
    }
    document.addEventListener('visibilitychange', resetWhenHidden)
    import('canvas-confetti').then(({ default: confetti }) => {
      confettiModule = confetti
      if (cancelled || document.hidden) return
      confetti({
        particleCount: 90,
        spread: 66,
        startVelocity: 34,
        gravity: 0.9,
        ticks: 120,
        colors: ['#F4B6C2', '#FFD9E0', '#FFF8F5'],
        origin: { x: 0.5, y: 0.64 },
        disableForReducedMotion: true,
      })
    }).catch((error) => console.error('Confetti gagal dimuat.', error))
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', resetWhenHidden)
      confettiModule?.reset()
    }
  }, [stage])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      hentikanMikrofon()
    }
  }, [hentikanMikrofon])

  async function aktifkanTiupan() {
    if (micAttemptRef.current || micRef.current.stream || stageRef.current !== 'sebelum') return
    micAttemptRef.current = true
    setMicLoading(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mountedRef.current || stageRef.current !== 'sebelum') {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      micRef.current = { stream, context: null, frame: null }
      const audioContext = new window.AudioContext()
      micRef.current.context = audioContext
      await audioContext.resume()
      if (!mountedRef.current || stageRef.current !== 'sebelum') {
        hentikanMikrofon()
        return
      }
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 256
      audioContext.createMediaStreamSource(stream).connect(analyser)

      const frequencies = new Uint8Array(analyser.frequencyBinCount)
      let suaraMulai = 0
      const pantauVolume = () => {
        if (stageRef.current !== 'sebelum') return
        analyser.getByteFrequencyData(frequencies)
        const lowBandAverage = frequencies.slice(0, 12).reduce((total, value) => total + value, 0) / 12
        if (lowBandAverage > 58) {
          if (!suaraMulai) suaraMulai = performance.now()
          if (performance.now() - suaraMulai >= 300) {
            tiupLilin()
            return
          }
        } else {
          suaraMulai = 0
        }
        micRef.current.frame = window.requestAnimationFrame(pantauVolume)
      }
      micRef.current.frame = window.requestAnimationFrame(pantauVolume)
    } catch {
      hentikanMikrofon()
    } finally {
      micAttemptRef.current = false
      if (mountedRef.current) setMicLoading(false)
    }
  }

  function ulangi() {
    hentikanMikrofon()
    stageRef.current = 'sebelum'
    setStage('sebelum')
  }

  return (
    <div className="flex min-h-full flex-col">
      <KejutanTabs />
      <section className="relative flex min-h-135 flex-1 flex-col items-center justify-center overflow-hidden px-7 pb-5 pt-4 text-center">
        <div className={`cake-atmosphere ${stage !== 'sebelum' ? 'is-dimmed' : ''}`} />
        {stage !== 'perayaan' ? (
          <>
            <KueIlustrasi padam={stage !== 'sebelum'} onTiup={tiupLilin} />
            <h1 className="relative mb-0 mt-4 max-w-[320px] font-display text-[26px] font-medium leading-[1.3]">
              {kue.instruksi.split('lalu')[0]}
              <em className="font-normal text-pink-blush">lalu{kue.instruksi.split('lalu')[1]}</em>
            </h1>
            {stage === 'sebelum' ? (
              <>
                <button type="button" onClick={tiupLilin} className="relative mt-5 min-h-14 rounded-full border-0 bg-pink-soft px-6 text-base font-semibold text-bg">
                  {kue.tombolTiup}
                </button>
                <button type="button" onClick={aktifkanTiupan} disabled={micLoading} className="relative mt-2 min-h-10 border-0 bg-transparent px-3 text-xs text-text2 underline decoration-line underline-offset-4 disabled:opacity-60">
                  {micLoading ? 'menyiapkan mikrofon…' : kue.tombolMikrofon}
                </button>
                <p className="relative mb-0 mt-2 font-hand text-[22px] leading-tight text-rose-gold" style={{ transform: 'rotate(-1.5deg)' }}>
                  {kue.petunjuk}
                </p>
              </>
            ) : (
              <p className="relative mt-4 font-hand text-[20px] text-rose-gold">sebentar, ya…</p>
            )}
          </>
        ) : (
          <div className="relative z-10 flex max-w-85 flex-col items-center">
            <div className="mb-5 text-[42px]" aria-hidden="true">✦</div>
            <p className="mb-2 mt-0 font-hand text-[22px] text-rose-gold">hari istimewamu</p>
            <h1 className="m-0 font-display text-[29px] font-medium leading-[1.3]">{kue.pesan.pembuka}</h1>
            <p className="mb-0 mt-4 text-[15px] leading-relaxed text-text2">{kue.pesan.penekanan}</p>
            <p className="mb-7 mt-5 self-end font-hand text-[24px] text-pink-blush">{kue.pesan.tandaTangan}</p>
            <div className="flex w-full flex-col gap-3">
              <Link to="/penutup" className="flex min-h-14 items-center justify-center rounded-full bg-pink-soft px-6 font-semibold text-bg no-underline">
                {kue.tombolSimpan}
              </Link>
              <button type="button" onClick={ulangi} className="min-h-12 rounded-full border border-line bg-transparent px-6 font-medium text-cream">
                {kue.tombolUlang}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
