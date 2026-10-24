import { useState } from 'react'

export default function FotoLazy({ src, alt = '', style, placeholder = '[foto]', fallback }) {
  const [loadedSrc, setLoadedSrc] = useState(null)
  const [failedSrc, setFailedSrc] = useState(null)
  const loaded = loadedSrc === src
  const failed = failedSrc === src

  return (
    <span
      className="photo-frame"
      style={{
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        background: fallback || 'linear-gradient(135deg,#33232C,#4A303D,#E8A9A0)',
        ...style,
      }}
    >
      {(!loaded || failed) && (
        <span className={`photo-skeleton ${failed ? 'is-fallback' : ''}`} aria-hidden="true">
          {failed && <span>{placeholder}</span>}
        </span>
      )}
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .25s ease-out',
          }}
        />
      )}
    </span>
  )
}
