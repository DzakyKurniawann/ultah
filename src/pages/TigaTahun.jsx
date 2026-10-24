import { useEffect, useRef } from 'react'
import KejutanTabs from '../components/KejutanTabs.jsx'
import content from '../content.js'

function PenutupTimeline() {
  return (
    <div className="timeline-finale">
      <svg viewBox="0 0 390 110" className="mb-2 w-full" fill="none" aria-hidden="true">
        <path d="M18 72c42-37 77-37 115 0s78 37 116 0 78-37 123 0" stroke="#E8A9A0" strokeWidth="2" strokeLinecap="round" />
        {[34, 89, 145, 201, 257, 313, 360].map((x, index) => (
          <g key={x} transform={`translate(${x} ${index % 2 === 0 ? 57 : 88})`}>
            <path d="M0-12c-3-5-9-4-9 1 0 6 9 11 9 11s9-5 9-11c0-5-6-6-9-1Z" fill={index % 2 ? '#FFD9E0' : '#F4B6C2'} />
          </g>
        ))}
        <path d="M195 20v15m-7-7h14" stroke="#FFD9E0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="195" cy="23" r="12" stroke="#E8A9A0" strokeOpacity=".55" />
      </svg>
      <p className="m-0 font-hand text-[34px] font-semibold leading-[1.1] text-pink-blush">{content.timeline.penutup}</p>
      <p className="mb-0 mt-2 text-[13px] text-text2">{content.timeline.penutupKecil}</p>
    </div>
  )
}

export default function TigaTahun() {
  const timelineRef = useRef(null)

  useEffect(() => {
    const root = timelineRef.current?.closest('main')
    const items = timelineRef.current?.querySelectorAll('.timeline-item')
    if (!items?.length) return undefined
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { root, threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-full">
      <KejutanTabs />
      <section className="rise px-5 pb-8 pt-5">
        <p className="mb-1 mt-0 font-hand text-[22px] text-rose-gold">sejauh ini, kita</p>
        <h1 className="m-0 font-display text-[34px] font-normal italic leading-tight">Tiga tahun kita</h1>
        <p className="mb-7 mt-2 text-[15px] leading-relaxed text-text2">{content.timeline.pengantar}</p>
        <div ref={timelineRef} className="timeline-list relative">
          {content.timeline.titik.map((titik, index) => (
            <article key={`${titik.tanggal}-${titik.judul}`} className={`timeline-item ${titik.hariIni ? 'is-today' : ''}`}>
              <span className="timeline-dot" aria-hidden="true" />
              <div>
                <p className="mb-1 mt-0 text-[13px] tracking-wide text-rose-gold">{titik.tanggal}</p>
                <h2 className={`m-0 font-display text-[23px] font-medium leading-tight ${titik.hariIni ? 'text-pink-blush' : 'text-cream'}`}>
                  {titik.judul}
                </h2>
                <p className="mb-0 mt-2 text-[14px] leading-[1.65] text-text2">{titik.cerita}</p>
              </div>
              {index !== content.timeline.titik.length - 1 && <span className="timeline-connector" aria-hidden="true" />}
            </article>
          ))}
        </div>
        <PenutupTimeline />
      </section>
    </div>
  )
}
