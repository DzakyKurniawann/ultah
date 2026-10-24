import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import content from '../content.js'
import { IkonKembali, IkonPlay } from '../components/icons.jsx'
import { useKembali } from '../lib/useKembali.js'
import { tanggalPendek } from '../lib/tanggal.js'
import FotoLazy from '../components/FotoLazy.jsx'

export default function AlbumDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const album = content.albums.find((item) => item.id === id)
  const kembali = useKembali('/')

  useEffect(() => {
    if (!album) navigate('/', { replace: true })
  }, [album, navigate])

  if (!album) return null

  const jumlahKenangan = album.kenangan.length
  const routePertama = `/kenangan/${album.id}/0`

  return (
    <div style={{ padding: 'calc(16px + env(safe-area-inset-top,0px)) 20px 28px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          type="button"
          aria-label="Kembali"
          onClick={kembali}
          className="-ml-2.5 flex h-11 w-11 flex-none items-center justify-center rounded-full border-0 bg-transparent text-cream"
        >
          <IkonKembali />
        </button>
        <span style={{ fontSize: 14, color: 'rgba(255,248,245,.72)' }}>{content.halamanAlbum.judulAwal} {content.halamanAlbum.judulPenekanan}</span>
      </header>

      <section
        className="rise"
        style={{
          position: 'relative',
          overflow: 'hidden',
          marginTop: 14,
          padding: '30px 24px 26px',
          borderRadius: 24,
          background: `linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`,
          color: '#1A1216',
        }}
      >
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 5%, rgba(255,248,245,.55), transparent 48%)' }} />
        <div style={{ position: 'relative' }}>
          <p style={{ margin: 0, fontFamily: 'Caveat,cursive', fontSize: 22 }}>{album.subjudul}</p>
          <h1 style={{ margin: '8px 0 0', fontFamily: 'Fraunces,serif', fontSize: 34, lineHeight: 1.15, fontWeight: 500 }}>{album.judul}</h1>
          <p style={{ margin: '12px 0 0', maxWidth: '34ch', fontSize: 14, lineHeight: 1.6 }}>{album.deskripsi}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 22 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{jumlahKenangan} {content.halamanAlbum.jumlahKenangan}</span>
            <Link
              to={routePertama}
              className="flex min-h-11 items-center gap-2 rounded-full px-4 text-[14px] font-semibold no-underline"
              style={{ background: '#1A1216', color: '#FFF8F5' }}
            >
              <IkonPlay size={16} />
              {content.halamanAlbum.mulaiPutar}
            </Link>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, margin: '28px 0 14px' }}>
        <h2 style={{ margin: 0, fontFamily: 'Fraunces,serif', fontSize: 24, fontWeight: 500 }}>{content.halamanAlbum.kenanganAwal}</h2>
        <span style={{ fontSize: 13, color: 'rgba(255,248,245,.65)' }}>{jumlahKenangan} {content.halamanAlbum.jumlahKenangan}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
        {album.kenangan.map((memory, index) => {
          const judul = memory.judul || content.halamanAlbum.tanpaJudul
          return (
            <Link
              key={`${memory.tanggal}-${index}`}
              to={`/kenangan/${album.id}/${index}`}
              aria-label={`Putar kenangan ${judul}`}
              className="card"
              style={{
                display: 'block',
                minWidth: 0,
                overflow: 'hidden',
                borderRadius: 16,
                background: '#261A21',
                color: '#FFF8F5',
                textDecoration: 'none',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  aspectRatio: '1 / 1',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  background: memory.foto ? '#33232C' : `linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`,
                }}
              >
                {memory.foto ? (
                  <FotoLazy src={memory.foto} alt={memory.caption || judul} style={{ width: '100%', height: '100%' }} fallback={`linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`} placeholder={content.foto.placeholder} />
                ) : (
                  <span style={{ fontFamily: 'Caveat,cursive', fontSize: 22, color: 'rgba(26,18,22,.62)' }}>{content.foto.placeholder}</span>
                )}
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: 9,
                    bottom: 9,
                    display: 'grid',
                    width: 34,
                    height: 34,
                    placeItems: 'center',
                    borderRadius: '50%',
                    background: 'rgba(26,18,22,.72)',
                    color: '#FFF8F5',
                  }}
                >
                  <IkonPlay size={16} />
                </span>
              </div>
              <div style={{ padding: '11px 12px 13px' }}>
                <p style={{ margin: 0, overflow: 'hidden', fontSize: 14, lineHeight: 1.4, fontWeight: 600, textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {judul}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: 'rgba(255,248,245,.65)' }}>{tanggalPendek(memory.tanggal)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
