import { Link } from 'react-router-dom'
import content from '../content.js'
import { IkonPlay } from '../components/icons.jsx'
import { tanggalPendek } from '../lib/tanggal.js'
import FotoLazy from '../components/FotoLazy.jsx'

export default function AlbumLibrary() {
  return (
    <div style={{ padding: 'calc(32px + env(safe-area-inset-top,0px)) 20px 28px' }}>
      <header>
        <p style={{ margin: 0, fontFamily: 'Caveat,cursive', fontSize: 22, color: '#E8A9A0' }}>{content.halamanAlbum.subjudul}</p>
        <h1 style={{ margin: '4px 0 0', fontFamily: 'Fraunces,serif', fontSize: 34, lineHeight: 1.2, fontWeight: 500 }}>
          {content.halamanAlbum.judulAwal} <em style={{ color: '#FFD9E0', fontWeight: 400 }}>{content.halamanAlbum.judulPenekanan}</em>
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'rgba(255,248,245,.72)' }}>{content.albums.length} album penuh cerita</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 14, marginTop: 24 }}>
        {content.albums.map((album) => {
          const kenanganPertama = album.kenangan[0]
          const foto = album.cover ?? album.kenangan.find((item) => item.foto)?.foto
          return (
            <Link
              key={album.id}
              to={`/album/${album.id}`}
              aria-label={`Buka album ${album.judul}`}
              className="card"
              style={{
                minWidth: 0,
                overflow: 'hidden',
                borderRadius: 18,
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
                  background: foto ? '#33232C' : `linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`,
                }}
              >
                {foto ? (
                  <FotoLazy src={foto} alt="" style={{ width: '100%', height: '100%' }} fallback={`linear-gradient(145deg,${album.gradien[0]},${album.gradien[1]})`} placeholder={content.foto.placeholder} />
                ) : (
                  <span style={{ fontFamily: 'Caveat,cursive', fontSize: 24, color: 'rgba(26,18,22,.62)' }}>{content.foto.placeholder}</span>
                )}
                <span
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
              <div style={{ padding: '12px 13px 14px' }}>
                <h2 style={{ margin: 0, fontFamily: 'Fraunces,serif', fontSize: 18, lineHeight: 1.2, fontWeight: 500 }}>{album.judul}</h2>
                <p style={{ margin: '6px 0 0', overflow: 'hidden', fontSize: 12, lineHeight: 1.5, color: 'rgba(255,248,245,.68)', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {album.subjudul}
                </p>
                <p style={{ margin: '9px 0 0', fontSize: 12, color: '#E8A9A0' }}>
                  {album.kenangan.length} {content.halamanAlbum.jumlahKenangan}
                  {kenanganPertama && ` · ${tanggalPendek(kenanganPertama.tanggal)}`}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
