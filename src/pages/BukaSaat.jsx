import { useEffect, useRef, useState } from 'react'
import KejutanTabs from '../components/KejutanTabs.jsx'
import content from '../content.js'
import { IkonKembali } from '../components/icons.jsx'

function Amplop({ data, index, selected, phase, onSelect }) {
  const opening = selected && phase >= 1
  return (
    <button
      type="button"
      className={`envelope-card ${opening ? 'is-opening' : ''} ${selected && phase >= 2 ? 'is-lifted' : ''} ${selected ? 'is-selected' : ''}`}
      style={{
        '--envelope-bg': data.warna.amplop,
        '--envelope-flap': data.warna.tutup,
        '--envelope-inner': data.warna.dalam,
        '--envelope-rotation': `${data.miring}deg`,
        '--envelope-layer': index,
      }}
      aria-label={data.label}
      aria-disabled={selected}
      onClick={() => !selected && onSelect(index)}
    >
      <span className="envelope-paper" aria-hidden="true" />
      <span className="envelope-inner" aria-hidden="true" />
      <span className="envelope-pocket" aria-hidden="true" />
      <span className="envelope-flap" aria-hidden="true" />
      <span className="envelope-seal" aria-hidden="true"><i /></span>
      <span className="envelope-label">{data.label}</span>
      {selected && phase >= 2 && <span className="envelope-lifted-note">{data.label}</span>}
    </button>
  )
}

function SuratTerbuka({ surat, activeIndex, onClose, onSelect, bukaKontak, calling, closing, carouselRef }) {
  const touchStartRef = useRef(null)

  useEffect(() => {
    carouselRef.current?.scrollTo({ left: carouselRef.current.clientWidth * activeIndex, behavior: 'smooth' })
  }, [activeIndex, carouselRef])

  const kontakTersedia = Boolean(content.linkWhatsApp || content.nomorTelepon)

  return (
    <div className={`letter-overlay ${closing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-label={surat.label}>
      <button type="button" className="letter-close" aria-label="Tutup surat" onClick={onClose}>
        <IkonKembali />
      </button>
      <div
        ref={carouselRef}
        className="letter-carousel no-scrollbar"
        onTouchStart={(event) => { touchStartRef.current = event.touches[0].clientX }}
        onTouchEnd={(event) => {
          const start = touchStartRef.current
          if (start === null) return
          const delta = start - event.changedTouches[0].clientX
          if (Math.abs(delta) > 45) onSelect(Math.max(0, Math.min(content.bukaSaat.amplop.length - 1, activeIndex + (delta > 0 ? 1 : -1))))
          touchStartRef.current = null
        }}
      >
        {content.bukaSaat.amplop.map((item, index) => (
          <article className="letter-slide" key={item.id} aria-hidden={index !== activeIndex}>
            <div className="letter-paper">
              <span className="letter-paper-tape" aria-hidden="true" />
              <p className="mb-4 mt-0 font-hand text-[22px] font-semibold text-rose-gold">{item.label}</p>
              <p className="m-0 whitespace-pre-line font-display text-[24px] leading-[1.55] text-[#33232C]">{item.teks}</p>
              <p className="mb-0 mt-6 text-right font-hand text-[32px] font-semibold text-[#33232C]">— {content.namaPengirim}</p>
              {item.aksi === 'telepon' && (
                <button
                  type="button"
                  className="mt-5 flex min-h-13 items-center justify-center gap-2 rounded-full border-0 bg-pink-soft px-6 text-[15px] font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={calling || !kontakTersedia}
                  onClick={bukaKontak}
                >
                  {calling ? 'Menghubungkan…' : content.bukaSaat.teleponLabel}
                </button>
              )}
              {item.aksi === 'telepon' && !kontakTersedia && (
                <p className="mb-0 mt-2 text-center text-xs text-[#6F5B63]">Tambahkan nomor telepon atau tautan WhatsApp di content.js.</p>
              )}
            </div>
            <span className="letter-swipe-hint">{content.bukaSaat.geserPetunjuk}</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export default function BukaSaat() {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [phase, setPhase] = useState(0)
  const [calling, setCalling] = useState(false)
  const [closing, setClosing] = useState(false)
  const timeoutsRef = useRef([])
  const callTimerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const carouselRef = useRef(null)

  useEffect(() => () => {
    timeoutsRef.current.forEach(window.clearTimeout)
    if (callTimerRef.current !== null) window.clearTimeout(callTimerRef.current)
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
  }, [])

  function pilihAmplop(index) {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
    setPhase(0)
    setClosing(false)
    timeoutsRef.current = [
      window.setTimeout(() => setPhase(1), 250),
      window.setTimeout(() => setPhase(2), 600),
      window.setTimeout(() => setPhase(3), 1100),
    ]
  }

  function tutupSurat() {
    if (closing) return
    timeoutsRef.current.forEach(window.clearTimeout)
    timeoutsRef.current = []
    if (callTimerRef.current !== null) window.clearTimeout(callTimerRef.current)
    callTimerRef.current = null
    setClosing(true)
    setCalling(false)
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedIndex(null)
      setPhase(0)
      setClosing(false)
      closeTimerRef.current = null
    }, 500)
  }

  function bukaKontak() {
    if (calling) return
    setCalling(true)
    callTimerRef.current = window.setTimeout(() => {
      const nomorTelepon = String(content.nomorTelepon || '').replace(/\D/g, '')
      const tujuan = content.linkWhatsApp ||
        (nomorTelepon ? `tel:+${nomorTelepon}` : '')
      callTimerRef.current = null
      setCalling(false)
      if (tujuan) window.location.href = tujuan
    }, 1200)
  }

  const suratAktif = selectedIndex === null ? null : content.bukaSaat.amplop[selectedIndex]

  return (
    <div className="relative min-h-full">
      <KejutanTabs />
      <section className="rise px-5 pb-8 pt-5">
        <p className="mb-1 mt-0 font-hand text-[22px] text-rose-gold">surat kecil untukmu</p>
        <h1 className="m-0 font-display text-[34px] font-medium leading-tight">{content.bukaSaat.judul}</h1>
        <p className="mb-0 mt-2 text-[14px] leading-relaxed text-text2">{content.bukaSaat.pengantar}</p>

        <div className={`envelope-stack ${selectedIndex !== null ? 'has-selection' : ''}`} aria-label="Pilih satu amplop">
          {content.bukaSaat.amplop.map((amplop, index) => (
            <Amplop
              key={amplop.id}
              data={amplop}
              index={index}
              selected={selectedIndex === index}
              phase={phase}
              onSelect={pilihAmplop}
            />
          ))}
        </div>
        <p className="mb-0 mt-3 text-center font-hand text-[20px] text-rose-gold">{content.bukaSaat.ketukUntukMembuka}</p>
      </section>

      {phase >= 3 && suratAktif && (
        <SuratTerbuka
          key="surat-terbuka"
          surat={suratAktif}
          activeIndex={selectedIndex}
          onClose={tutupSurat}
          onSelect={setSelectedIndex}
          bukaKontak={bukaKontak}
          calling={calling}
          closing={closing}
          carouselRef={carouselRef}
        />
      )}
    </div>
  )
}
