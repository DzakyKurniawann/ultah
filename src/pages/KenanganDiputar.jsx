import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import content from '../content.js'
import { IkonKembali } from '../components/icons.jsx'
import { useKembali } from '../lib/useKembali.js'
import { tanggalPendek } from '../lib/tanggal.js'
import FotoLazy from '../components/FotoLazy.jsx'

const DURASI_KENANGAN = 10_000
const rotasiFoto = (index) => ((index * 1.5) % 4) - 2

export default function KenanganDiputar() {
  const { albumId, index } = useParams()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const album = content.albums.find((item) => item.id === albumId)
  const indexNumber = Number(index)
  const validIndex = Number.isInteger(indexNumber) && indexNumber >= 0 && indexNumber < (album?.kenangan.length ?? 0)
  const currentIndex = validIndex ? indexNumber : 0
  const memory = album?.kenangan[currentIndex]
  const kembali = useKembali(`/album/${albumId}`)
  const [direction, setDirection] = useState(1)
  const [edgeBounce, setEdgeBounce] = useState(0)
  const pointerStart = useRef(null)
  const ignoreClick = useRef(false)
  const bounceTimer = useRef(null)

  useEffect(() => {
    if (!album) {
      navigate('/', { replace: true })
      return
    }
    if (!validIndex) navigate(`/kenangan/${album.id}/0`, { replace: true })
  }, [album, navigate, validIndex])

  useEffect(() => () => window.clearTimeout(bounceTimer.current), [])

  useEffect(() => {
    if (!album || !validIndex) return undefined

    const timer = window.setTimeout(() => {
      if (currentIndex + 1 < album.kenangan.length) {
        setDirection(1)
        navigate(`/kenangan/${album.id}/${currentIndex + 1}`, { replace: true })
      } else {
        navigate(`/album/${album.id}`, { replace: true })
      }
    }, DURASI_KENANGAN)

    return () => window.clearTimeout(timer)
  }, [album, currentIndex, navigate, validIndex])

  const pindahKe = (nextIndex, nextDirection) => {
    if (nextIndex < 0) {
      setEdgeBounce(1)
      window.clearTimeout(bounceTimer.current)
      bounceTimer.current = window.setTimeout(() => setEdgeBounce(0), 280)
      return
    }
    if (nextIndex >= (album?.kenangan.length ?? 0)) {
      navigate(`/album/${album.id}`, { replace: true })
      return
    }
    setDirection(nextDirection)
    navigate(`/kenangan/${album.id}/${nextIndex}`, { replace: true })
  }

  const mulaiGeser = (event) => {
    if (event.button !== 0 || event.target.closest('[data-no-story-navigation]')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerStart.current = { x: event.clientX, y: event.clientY }
    ignoreClick.current = false
  }

  const akhiriGeser = (event) => {
    if (!pointerStart.current) return
    const deltaX = event.clientX - pointerStart.current.x
    const deltaY = event.clientY - pointerStart.current.y
    pointerStart.current = null
    if (Math.abs(deltaX) < 56 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return

    event.preventDefault()
    ignoreClick.current = true
    pindahKe(currentIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1)
  }

  const tanganiKetuk = (event) => {
    if (ignoreClick.current) {
      ignoreClick.current = false
      return
    }
    if (event.target.closest('[data-no-story-navigation]')) return

    const batas = event.currentTarget.getBoundingClientRect()
    const posisi = (event.clientX - batas.left) / batas.width
    if (posisi < 0.45) pindahKe(currentIndex - 1, -1)
    else if (posisi > 0.55) pindahKe(currentIndex + 1, 1)
    else navigate(`/foto/${album.id}/${currentIndex}`)
  }

  const animasiFoto = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18 },
      }
    : {
        initial: { opacity: 0, x: direction * 48, rotate: rotasiFoto(currentIndex) + direction * 2 },
        animate: { opacity: 1, x: edgeBounce ? [0, edgeBounce * 8, 0] : 0, rotate: rotasiFoto(currentIndex) },
        exit: { opacity: 0, x: direction * -20, transition: { duration: 0.28, ease: 'easeIn' } },
        transition: {
          opacity: { duration: 0.42, delay: 0.14 },
          x: { type: 'spring', stiffness: 260, damping: 28, delay: 0.14 },
          rotate: { type: 'spring', stiffness: 260, damping: 28, delay: 0.14 },
        },
      }

  if (!album || !memory) return null

  const judul = memory.judul || content.halamanAlbum.tanpaJudul
  const judulBagian = judul.trim().split(/\s+/)
  const postJudul = judulBagian.length > 1 ? judulBagian.slice(1).join(' ') : ''
  const gayaFade = (delay) => prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.18 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.59, delay, ease: [0.22, 0.8, 0.2, 1] },
      }

  return (
    <div
      onPointerDown={mulaiGeser}
      onPointerUp={akhiriGeser}
      onPointerCancel={() => { pointerStart.current = null }}
      onClick={tanganiKetuk}
      style={{
        position: 'relative',
        minHeight: '100%',
        padding: 'calc(12px + env(safe-area-inset-top,0px)) 20px calc(28px + env(safe-area-inset-bottom,0px))',
        background: 'linear-gradient(180deg, rgba(244,182,194,.42), rgba(232,169,160,.12) 55%, #1A1216 85%), #1A1216',
        display: 'flex',
        flexDirection: 'column',
        touchAction: 'pan-y',
      }}
    >
      <div
        aria-label={`Progres kenangan ${currentIndex + 1} dari ${album.kenangan.length}`}
        style={{ display: 'flex', gap: 4, width: '100%' }}
      >
        {album.kenangan.map((item, itemIndex) => (
          <span key={`${item.tanggal}-${itemIndex}`} style={{ flex: 1, height: 3, borderRadius: 2, overflow: 'hidden', background: 'rgba(255,248,245,.28)' }}>
            <motion.span
              key={`${itemIndex}-${currentIndex}`}
              initial={{ scaleX: itemIndex < currentIndex ? 1 : 0 }}
              animate={{ scaleX: itemIndex <= currentIndex ? 1 : 0 }}
              transition={{ duration: itemIndex === currentIndex ? DURASI_KENANGAN / 1000 : 0, ease: 'linear' }}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                borderRadius: 2,
                background: '#FFF8F5',
                transformOrigin: 'left center',
              }}
            />
          </span>
        ))}
      </div>

      <header style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, minHeight: 44 }}>
        <button
          type="button"
          data-no-story-navigation
          aria-label="Kembali ke album"
          onClick={(event) => {
            event.stopPropagation()
            kembali()
          }}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border-0 bg-transparent text-cream"
        >
          <IkonKembali />
        </button>
        <p style={{ margin: 0, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, color: 'rgba(255,248,245,.86)' }}>
          Dari album: {album.judul}
        </p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12, pointerEvents: 'none' }}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`${album.id}-${currentIndex}`}
            aria-label={`Foto kenangan: ${judul}`}
            {...animasiFoto}
            className="relative block w-full max-w-78 text-left"
            style={{
              padding: '12px 12px 56px',
              borderRadius: 2,
              color: '#33232C',
              backgroundImage: 'radial-gradient(circle at 18% 10%, rgba(255,255,255,.75), transparent 42%), repeating-linear-gradient(135deg, rgba(111,73,67,.025) 0, rgba(111,73,67,.025) 1px, transparent 1px, transparent 4px), linear-gradient(145deg,#FFF8F5,#FFF8F5)',
              boxShadow: '0 18px 40px rgba(0,0,0,.28), 0 3px 8px rgba(0,0,0,.18), 0 0 0 1px rgba(255,248,245,.18)',
              transformOrigin: 'center center',
            }}
          >
            <span
              style={{
                display: 'flex',
                height: 'min(30dvh, 270px)',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: memory.foto ? '#33232C' : `linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`,
              }}
            >
              {memory.foto ? (
                <FotoLazy src={memory.foto} alt={memory.caption || judul} style={{ width: '100%', height: '100%' }} fallback={`linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`} placeholder={content.foto.placeholder} />
              ) : (
                <span style={{ fontFamily: 'Caveat,cursive', fontSize: 26, color: 'rgba(26,18,22,.62)' }}>{content.foto.placeholder}</span>
              )}
            </span>
            <motion.span
              key={`caption-${currentIndex}`}
              {...(prefersReducedMotion
                ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.18 } }
                : {
                    initial: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                    animate: { opacity: 1, clipPath: 'inset(0 0% 0 0)' },
                    exit: { opacity: 0, clipPath: 'inset(0 100% 0 0)' },
                    transition: { duration: 0.5, delay: 0.71, ease: 'easeOut' },
                  })}
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                textAlign: 'center',
                fontFamily: 'Caveat,cursive',
                fontSize: 26,
                lineHeight: 1,
                color: '#33232C',
                transform: 'rotate(-1deg)',
              }}
            >
              {memory.caption || content.kenanganDiputar.captionKosong}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section key={`detail-${currentIndex}`} aria-live="polite" style={{ textAlign: 'center', marginTop: 20, pointerEvents: 'none' }}>
          <motion.h1
            {...gayaFade(0.71)}
            style={{ margin: 0, fontFamily: 'Fraunces,serif', fontSize: 28, lineHeight: 1.2, fontWeight: 500 }}
          >
            {judulBagian[0]}{postJudul && <> <em style={{ color: '#FFD9E0', fontWeight: 400 }}>{postJudul}</em></>}
          </motion.h1>
          <motion.p
            {...gayaFade(0.79)}
            style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,248,245,.68)' }}
          >
            {tanggalPendek(memory.tanggal)}
          </motion.p>
          <motion.p
            {...gayaFade(0.87)}
            style={{ maxWidth: '34ch', margin: '12px auto 0', fontSize: 16, lineHeight: 1.6, color: 'rgba(255,248,245,.9)' }}
          >
            {memory.cerita || content.kenanganDiputar.ceritaKosong}
          </motion.p>
        </motion.section>
      </AnimatePresence>

      <p style={{ margin: 'auto 0 0', paddingTop: 24, textAlign: 'center', fontFamily: 'Caveat,cursive', fontSize: 20, color: '#E8A9A0', pointerEvents: 'none' }}>
        {content.kenanganDiputar.petunjuk}
      </p>
    </div>
  )
}
