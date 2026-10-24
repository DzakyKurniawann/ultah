import { createContext, useContext } from 'react'

export const AudioContext = createContext(null)
export const AudioActionsContext = createContext(null)
export const AudioPlaybackContext = createContext(null)

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio harus dipakai di dalam AudioProvider')
  return ctx
}

export function useAudioActions() {
  const ctx = useContext(AudioActionsContext)
  if (!ctx) throw new Error('useAudioActions harus dipakai di dalam AudioProvider')
  return ctx
}

export function useAudioPlayback() {
  const ctx = useContext(AudioPlaybackContext)
  if (ctx === null) throw new Error('useAudioPlayback harus dipakai di dalam AudioProvider')
  return ctx
}
