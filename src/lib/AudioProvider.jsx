import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AudioActionsContext, AudioContext, AudioPlaybackContext } from './AudioContext.js'

export function AudioProvider({ children }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audioError, setAudioError] = useState(false)

  useEffect(() => {
    const a = ref.current
    if (!a) return undefined
    const readDuration = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0)
    const onPlay = () => {
      setPlaying(true)
      setAudioError(false)
    }
    const onPause = () => setPlaying(false)
    const onTime = () => setCurrentTime(a.currentTime)
    const onEnded = () => {
      a.currentTime = 0
      setCurrentTime(0)
      setPlaying(false)
    }
    const handlers = {
      play: onPlay, playing: onPlay, pause: onPause,
      error: () => { onPause(); setAudioError(true) },
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
      if (p && typeof p.catch === 'function') p.catch(() => setAudioError(true))
    } catch {
      setAudioError(true)
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

  const readCurrentTime = useCallback(() => ref.current?.currentTime ?? 0, [])

  const restart = useCallback(() => {
    seek(0)
    play()
  }, [seek, play])

  const value = useMemo(
    () => ({ playing, currentTime, duration, audioError, play, pause, toggle, seek, restart, readCurrentTime }),
    [playing, currentTime, duration, audioError, play, pause, toggle, seek, restart, readCurrentTime],
  )
  const actions = useMemo(
    () => ({ play, pause, toggle, seek, restart, readCurrentTime }),
    [play, pause, toggle, seek, restart, readCurrentTime],
  )

  return (
    <AudioActionsContext.Provider value={actions}>
      <AudioPlaybackContext.Provider value={playing}>
        <AudioContext.Provider value={value}>
          {children}
          <audio ref={ref} src={import.meta.env.BASE_URL + 'komang.mp3'} preload="metadata" aria-hidden="true" tabIndex={-1} className="sr-only" />
        </AudioContext.Provider>
      </AudioPlaybackContext.Provider>
    </AudioActionsContext.Provider>
  )
}
