import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const a = ref.current
    if (!a) return undefined
    const readDuration = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime = () => setCurrentTime(a.currentTime)
    const onEnded = () => {
      a.currentTime = 0
      setCurrentTime(0)
      setPlaying(false)
    }
    const handlers = {
      play: onPlay, playing: onPlay, pause: onPause, error: onPause,
      timeupdate: onTime, loadedmetadata: readDuration, durationchange: readDuration, ended: onEnded,
    }
    Object.entries(handlers).forEach(([e, h]) => a.addEventListener(e, h))
    return () => Object.entries(handlers).forEach(([e, h]) => a.removeEventListener(e, h))
  }, [])

  // play() hanya dipanggil dari handler event pengguna (tidak ada autoplay)
  const play = useCallback(() => {
    const a = ref.current
    if (!a) return
    try {
      const p = a.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {
      /* diabaikan: tanpa error di layar */
    }
  }, [])

  const pause = useCallback(() => {
    ref.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    const a = ref.current
    if (!a) return
    if (a.paused) play()
    else pause()
  }, [play, pause])

  const seek = useCallback((detik) => {
    const a = ref.current
    if (!a) return
    const maks = Number.isFinite(a.duration) ? a.duration : detik
    a.currentTime = Math.max(0, Math.min(detik, maks))
    setCurrentTime(a.currentTime)
  }, [])

  const restart = useCallback(() => {
    seek(0)
    play()
  }, [seek, play])

  const value = useMemo(
    () => ({ playing, currentTime, duration, play, pause, toggle, seek, restart }),
    [playing, currentTime, duration, play, pause, toggle, seek, restart],
  )

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio ref={ref} src={import.meta.env.BASE_URL + 'komang.mp3'} preload="none" />
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio harus dipakai di dalam AudioProvider')
  return ctx
}
