import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import content from '../content.js'
import { IkonKembali } from '../components/icons.jsx'

function IlustrasiSurat() {
  return (
    <svg width="210" height="174" viewBox="0 0 210 174" fill="none" aria-hidden="true">
      <path d="M28 48c0-5.5 4.5-10 10-10h134c5.5 0 10 4.5 10 10v91H28V48Z" fill="#FFF8F5" />
      <path d="M28 57 105 112l77-55v82H28V57Z" fill="#F4B6C2" />
      <path d="m28 57 77 55 77-55" stroke="#E8A9A0" strokeWidth="2" strokeLinejoin="round" />
      <path d="M66 33c0-8 6-14 14-14 7 0 12 5 12 11 0 8-12 15-12 15S66 39 66 33Z" fill="#E8A9A0" />
      <path d="M145 26h18M154 17v18" stroke="#FFD9E0" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 148c18 13 45 19 67 17m67-17c-7 7-16 11-27 14" stroke="#E8A9A0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Surat() {
  const S = content.surat
  const prefersReducedMotion = useReducedMotion()
  const [mode, setMode] = useState('awal')
  const [amplopTerpilih, setAmplopTerpilih] = useState(-1)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const progressRef = useRef(null)
  const linesRef = useRef([])
  const spacerAtasRef = useRef(null)
  const spacerBawahRef = useRef(null)
  const akhirTombolRef = useRef(null)
  const activeRef = useRef(0)
  const frameRef = useRef(null)
  const mulaiDariAtasRef = useRef(true)

  const baris = useMemo(
    () => S.bait.flatMap((bait, index) => index === 0 ? bait : ['', ...bait]),
    [S.bait],
  )
  const indeksBaris = useMemo(
    () => baris.reduce((indices, text, index) => {
      if (text) indices.push(index)
      return indices
    }, []),
    [baris],
  )
  const indeksTerakhir = indeksBaris[indeksBaris.length - 1] ?? 0

  useEffect(() => {
    if (mode !== 'membaca') return undefined
    const areaHalaman = containerRef.current?.closest('main')
    if (!areaHalaman) return undefined

    const overflowAwal = areaHalaman.style.overflowY
    areaHalaman.scrollTo({ top: 0, behavior: 'auto' })
    areaHalaman.style.overflowY = 'hidden'
    return () => { areaHalaman.style.overflowY = overflowAwal }
  }, [mode])

  useEffect(() => {
    if (mode !== 'membaca') return undefined

    const container = containerRef.current
    if (!container) return undefined

    const mulaiDariAtas = mulaiDariAtasRef.current
    mulaiDariAtasRef.current = false
    const sesuaikanUjung = () => {
      const firstLine = linesRef.current[indeksBaris[0]]
      const lastLine = linesRef.current[indeksTerakhir]
      const target = container.clientHeight * 0.4
      if (firstLine && spacerAtasRef.current) {
        spacerAtasRef.current.style.height = `${Math.max(0, target - firstLine.offsetHeight / 2 - 14)}px`
      }
      if (lastLine && spacerBawahRef.current) {
        const akhirTombol = akhirTombolRef.current
        const jarakTombol = akhirTombol ? Number.parseFloat(getComputedStyle(akhirTombol).marginTop) || 0 : 0
        const tinggiTombol = akhirTombol?.offsetHeight ?? 0
        spacerBawahRef.current.style.height = `${Math.max(0, container.clientHeight * 0.6 - lastLine.offsetHeight / 2 - jarakTombol - tinggiTombol)}px`
      }
    }
    sesuaikanUjung()

    const barisKelima = linesRef.current[indeksBaris[Math.min(4, indeksBaris.length - 1)]]
    if (mulaiDariAtas) {
      container.scrollTo({ top: 0, behavior: 'auto' })
    } else if (barisKelima) {
      const containerRect = container.getBoundingClientRect()
      const lineRect = barisKelima.getBoundingClientRect()
      const top = container.scrollTop + lineRect.top - containerRect.top - container.clientHeight * 0.4 + lineRect.height / 2
      container.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
    if (progressRef.current) progressRef.current.style.transform = 'scaleX(0)'

    const ukurScroll = () => {
      frameRef.current = null
      const maxScroll = container.scrollHeight - container.clientHeight
      const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, container.scrollTop / maxScroll)) : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${ratio})`

      const target = container.getBoundingClientRect().top + container.clientHeight * 0.4
      let nearestIndex = activeRef.current
      let nearestDistance = Infinity
      const diAtas = container.scrollTop <= 2
      const diBawah = maxScroll <= 2 || maxScroll - container.scrollTop <= 3
      if (diAtas) nearestIndex = indeksBaris[0] ?? 0
      else if (diBawah) nearestIndex = indeksTerakhir
      else {
        indeksBaris.forEach((index) => {
          const line = linesRef.current[index]
          if (!line) return
          const rect = line.getBoundingClientRect()
          const distance = Math.abs(rect.top + rect.height / 2 - target)
          if (distance < nearestDistance) {
            nearestDistance = distance
            nearestIndex = index
          }
        })
      }

      if (nearestIndex !== activeRef.current) {
        activeRef.current = nearestIndex
        setActiveIndex(nearestIndex)
      }
    }

    const onScroll = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(ukurScroll)
    }
    const observer = new ResizeObserver(() => {
      sesuaikanUjung()
      onScroll()
    })
    observer.observe(container)
    const firstLine = linesRef.current[indeksBaris[0]]
    const lastLine = linesRef.current[indeksTerakhir]
    if (firstLine) observer.observe(firstLine)
    if (lastLine) observer.observe(lastLine)
    if (akhirTombolRef.current) observer.observe(akhirTombolRef.current)

    container.addEventListener('scroll', onScroll, { passive: true })
    frameRef.current = window.requestAnimationFrame(ukurScroll)
    return () => {
      container.removeEventListener('scroll', onScroll)
      observer.disconnect()
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [indeksBaris, indeksTerakhir, mode, prefersReducedMotion])

  const mulaiMembaca = () => {
    activeRef.current = 0
    setActiveIndex(0)
    setMode('membaca')
  }

  const pilihAmplop = (index) => setAmplopTerpilih(index)
  const geserSurat = (arah) => {
    setAmplopTerpilih((current) => (current + arah + content.bukaSaat.amplop.length) % content.bukaSaat.amplop.length)
  }

  const bacaLagi = () => {
    activeRef.current = 0
    setActiveIndex(0)
    mulaiDariAtasRef.current = true
    setMode('membaca')
  }

  if (mode === 'membaca') {
    return (
      <section
        aria-label="Membaca surat"
        style={{
          display: 'flex',
          height: '100%',
          minHeight: 0,
          flexDirection: 'column',
          padding: 'calc(18px + env(safe-area-inset-top,0px)) 20px 12px',
          overflow: 'hidden',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', minHeight: 44, paddingBottom: 12 }}>
          <span style={{ fontFamily: 'Fraunces,serif', fontSize: 20, color: '#FFD9E0' }}>{S.judul}</span>
        </header>

        <div aria-label="Progres membaca surat" style={{ height: 2, flex: 'none', overflow: 'hidden', borderRadius: 2, background: 'rgba(255,248,245,.14)' }}>
          <span
            ref={progressRef}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              background: '#E8A9A0',
              transform: 'scaleX(0)',
              transformOrigin: 'left center',
            }}
          />
        </div>

        <div
          ref={containerRef}
          className="no-scrollbar"
          style={{ minHeight: 0, flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', padding: '0 2px', scrollbarWidth: 'none', overflowAnchor: 'none' }}
        >
          <div ref={spacerAtasRef} aria-hidden="true" />
          {baris.map((text, index) => text ? (
            <p
              key={`line-${index}`}
              ref={(element) => { linesRef.current[index] = element }}
              style={{
                margin: '14px 0 0',
                fontFamily: 'Fraunces,serif',
                fontSize: 26,
                fontWeight: 500,
                lineHeight: 1.5,
                color: index === activeIndex ? '#FFF8F5' : '#F4B6C2',
                opacity: index === activeIndex ? 1 : index < activeIndex ? 0.25 : 0.35,
                transition: 'opacity .4s ease-out, color .4s ease-out',
              }}
            >
              {text}
            </p>
          ) : (
            <div key={`space-${index}`} aria-hidden="true" style={{ height: 30 }} />
          ))}
          <div ref={spacerBawahRef} aria-hidden="true" />
          <button
            ref={akhirTombolRef}
            type="button"
            onClick={() => setMode('akhir')}
            className="mt-8 min-h-11 rounded-full border border-line bg-surface px-5 text-[14px] font-semibold text-cream"
          >
            {S.akhiriSurat}
          </button>
        </div>
      </section>
    )
  }

  if (mode === 'akhir') {
    return (
      <>
        <section
          style={{
            display: 'flex',
            minHeight: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'calc(40px + env(safe-area-inset-top,0px)) 28px calc(36px + env(safe-area-inset-bottom,0px))',
            textAlign: 'center',
          }}
        >
          <div aria-hidden="true" style={{ marginBottom: 24, color: '#F4B6C2' }}><IlustrasiSurat /></div>
          <h1 style={{ margin: 0, fontFamily: 'Fraunces,serif', fontSize: 30, lineHeight: 1.25, fontWeight: 500, color: '#FFF8F5' }}>
            {S.akhir.judul}
          </h1>
          <p style={{ maxWidth: '32ch', margin: '16px 0 0', fontFamily: 'Fraunces,serif', fontSize: 20, lineHeight: 1.55, color: '#F4B6C2' }}>
            {S.akhir.cerita}
          </p>
          <p style={{ margin: '22px 0 0', fontFamily: 'Caveat,cursive', fontSize: 26, color: '#E8A9A0' }}>{S.tandaTangan}</p>
          <p style={{ margin: '26px 0 0', fontFamily: 'Caveat,cursive', fontSize: 20, color: '#E8A9A0' }}>{S.catatanAkhir}</p>
          <div style={{ display: 'flex', width: '100%', flexDirection: 'column', gap: 10, marginTop: 24 }}>
            <button
              type="button"
              onClick={bacaLagi}
              className="min-h-12 rounded-full border border-line bg-transparent px-5 text-[15px] font-semibold text-cream"
            >
              {S.bacaLagi}
            </button>
            <Link
              to="/kejutan"
              className="flex min-h-12 items-center justify-center rounded-full bg-pink-soft px-5 text-[15px] font-semibold text-bg no-underline"
            >
              {S.lanjutKejutan}
            </Link>
          </div>
        </section>
        <DaftarBukaSaat onSelect={pilihAmplop} />
        {amplopTerpilih >= 0 && (
          <SuratBukaSaat
            amplop={content.bukaSaat.amplop[amplopTerpilih]}
            index={amplopTerpilih}
            onClose={() => setAmplopTerpilih(-1)}
            onNext={() => geserSurat(1)}
            onPrevious={() => geserSurat(-1)}
          />
        )}
      </>
    )
  }

  return (
    <>
      <section
        className="rise"
        style={{
          padding: 'calc(24px + env(safe-area-inset-top,0px)) 24px 28px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse 90% 45% at 50% 0%,rgba(244,182,194,.17),transparent 70%), radial-gradient(ellipse 70% 30% at 50% 100%,rgba(244,182,194,.08),transparent 70%)',
        }}
      >
        <div style={{ display: 'flex', minHeight: 'min(52dvh, 440px)', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <IlustrasiSurat />
          <p style={{ margin: '20px 0 0', fontFamily: 'Caveat,cursive', fontSize: 24, color: '#E8A9A0', transform: 'rotate(-2deg)' }}>{S.keterangan}</p>
          <h1 style={{ maxWidth: '14ch', margin: '10px 0 0', fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontSize: 34, lineHeight: 1.25, fontWeight: 400, color: '#FFD9E0' }}>
            {S.judul}
          </h1>
          <button
            type="button"
            onClick={mulaiMembaca}
            className="mt-7 min-h-14 rounded-full bg-pink-soft px-7 text-[16px] font-semibold text-bg"
          >
            {S.bacaSurat}
          </button>
        </div>
      </section>

      <DaftarBukaSaat onSelect={pilihAmplop} />

      {amplopTerpilih >= 0 && (
        <SuratBukaSaat
          amplop={content.bukaSaat.amplop[amplopTerpilih]}
          index={amplopTerpilih}
          onClose={() => setAmplopTerpilih(-1)}
          onNext={() => geserSurat(1)}
          onPrevious={() => geserSurat(-1)}
        />
      )}
    </>
  )
}

function DaftarBukaSaat({ onSelect }) {
  return (
    <section style={{ padding: '8px 20px 28px' }}>
      <h2 style={{ margin: 0, fontFamily: 'Fraunces,serif', fontSize: 26, fontStyle: 'italic', fontWeight: 400 }}>{content.bukaSaat.judul}</h2>
      <p style={{ margin: '7px 0 0', fontSize: 14, lineHeight: 1.55, color: 'rgba(255,248,245,.78)' }}>{content.bukaSaat.pengantar}</p>
      <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
        {content.bukaSaat.amplop.map((amplop, index) => (
          <button
            key={amplop.id}
            type="button"
            aria-label={`Buka ${amplop.label}`}
            onClick={() => onSelect(index)}
            className="card"
            style={{
              position: 'relative',
              display: 'flex',
              minHeight: 92,
              alignItems: 'center',
              gap: 16,
              overflow: 'hidden',
              padding: '14px 16px',
              border: '1px solid rgba(232,169,160,.22)',
              borderRadius: 18,
              background: 'linear-gradient(135deg,#33232C,#261A21)',
              color: '#FFF8F5',
              textAlign: 'left',
            }}
          >
            <span aria-hidden="true" style={{ position: 'relative', display: 'block', width: 74, height: 50, flex: 'none', overflow: 'hidden', borderRadius: 7, background: amplop.warna.amplop, boxShadow: '0 5px 14px rgba(0,0,0,.22)' }}>
              <span style={{ position: 'absolute', inset: 0, background: amplop.warna.tutup, clipPath: 'polygon(0 0,100% 0,50% 60%)' }} />
              <span style={{ position: 'absolute', left: '50%', top: '50%', width: 20, height: 20, transform: 'translate(-50%,-20%)', borderRadius: '50%', background: `radial-gradient(circle at 35% 30%,${amplop.warna.dalam},${amplop.warna.tutup})`, boxShadow: '0 2px 4px rgba(0,0,0,.2)' }} />
            </span>
            <span style={{ minWidth: 0, flex: 1 }}>
              <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#FFD9E0' }}>{amplop.label}</span>
              <span style={{ display: 'block', marginTop: 5, fontSize: 12, color: 'rgba(255,248,245,.65)' }}>{content.bukaSaat.ketukUntukMembuka}</span>
            </span>
            <span aria-hidden="true" style={{ color: '#E8A9A0', fontSize: 22 }}>›</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function SuratBukaSaat({ amplop, index, onClose, onNext, onPrevious }) {
  const touchStart = useRef(null)

  const mulaiGeser = (event) => {
    touchStart.current = { x: event.clientX, y: event.clientY }
  }

  const selesaiGeser = (event) => {
    if (!touchStart.current) return
    const deltaX = event.clientX - touchStart.current.x
    const deltaY = event.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.3) return
    if (deltaX < 0) onNext()
    else onPrevious()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={amplop.label}
      onPointerDown={mulaiGeser}
      onPointerUp={selesaiGeser}
      onPointerCancel={() => { touchStart.current = null }}
      style={{
        position: 'fixed',
        zIndex: 50,
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: 'calc(76px + env(safe-area-inset-top,0px)) 20px calc(88px + env(safe-area-inset-bottom,0px))',
        background: 'radial-gradient(ellipse 90% 45% at 50% 0%,rgba(244,182,194,.17),transparent 70%), #1A1216',
      }}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: 412, minHeight: 'min(650px, calc(100dvh - 164px))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div aria-label={`Surat ${index + 1} dari ${content.bukaSaat.amplop.length}`} style={{ position: 'absolute', top: -48, left: 4, right: 4, display: 'flex', gap: 6 }}>
          {content.bukaSaat.amplop.map((item, itemIndex) => (
            <span key={item.id} style={{ height: 3, flex: 1, borderRadius: 2, background: itemIndex === index ? '#F4B6C2' : 'rgba(255,248,245,.25)' }} />
          ))}
        </div>
        <button
          type="button"
          aria-label="Tutup surat"
          onClick={onClose}
          className="absolute -top-14 left-0 flex h-11 w-11 items-center justify-center rounded-full border-0 text-cream"
          style={{ background: 'rgba(255,248,245,.1)' }}
        >
          <IkonKembali />
        </button>
        <article
          style={{
            position: 'relative',
            width: '100%',
            minHeight: 'min(560px, 68dvh)',
            padding: '38px 26px 28px',
            transform: `rotate(${amplop.miring}deg)`,
            color: '#33232C',
            background: `linear-gradient(145deg,rgba(255,255,255,.55),transparent 42%),${amplop.warna.amplop}`,
            boxShadow: '0 18px 40px rgba(0,0,0,.5)',
          }}
        >
          <span aria-hidden="true" style={{ position: 'absolute', top: -12, left: 'calc(50% - 42px)', width: 84, height: 26, transform: 'rotate(-3deg)', background: amplop.warna.tutup, opacity: 0.9 }} />
          <h1 style={{ margin: 0, fontFamily: 'Caveat,cursive', fontSize: 34, lineHeight: 1.1, fontWeight: 600 }}>{amplop.label}</h1>
          <p style={{
            margin: '22px 0 0',
            whiteSpace: 'pre-line',
            fontFamily: 'Caveat,cursive',
            fontSize: 30,
            lineHeight: 1.48,
            backgroundImage: 'repeating-linear-gradient(to bottom,transparent 0,transparent 43px,rgba(232,169,160,.32) 43px,rgba(232,169,160,.32) 44px)',
          }}>
            {amplop.teks}
          </p>
          <p style={{ margin: '22px 0 0', textAlign: 'right', fontFamily: 'Caveat,cursive', fontSize: 32, fontWeight: 600, color: '#33232C' }}>
            {content.surat.tandaTangan}
          </p>
          {amplop.aksi === 'telepon' && (
            <a
              href={`tel:${content.nomorTelepon}`}
              className="mt-5 inline-flex min-h-13 items-center rounded-full px-6 text-[15px] font-semibold no-underline"
              style={{ background: '#F4B6C2', color: '#1A1216', boxShadow: '0 6px 16px rgba(26,18,22,.25)' }}
            >
              {content.bukaSaat.teleponLabel}
            </a>
          )}
        </article>
        <p style={{ position: 'absolute', bottom: -52, left: 0, right: 0, margin: 0, textAlign: 'center', fontSize: 13, color: 'rgba(255,248,245,.7)' }}>
          {content.bukaSaat.geserPetunjuk}
        </p>
        <div style={{ position: 'absolute', bottom: -104, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <button type="button" onClick={onPrevious} className="min-h-10 rounded-full border border-line bg-surface px-4 text-[13px] text-cream">
            {content.bukaSaat.suratSebelumnya}
          </button>
          <button type="button" onClick={onNext} className="min-h-10 rounded-full border border-line bg-surface px-4 text-[13px] text-cream">
            {content.bukaSaat.suratBerikutnya}
          </button>
        </div>
      </div>
    </div>
  )
}
