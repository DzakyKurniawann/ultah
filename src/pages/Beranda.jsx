import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import content from '../content.js'
import { hariBersama, kunciSapaan, tanggalPanjang } from '../lib/tanggal.js'
import FotoLazy from '../components/FotoLazy.jsx'

const tunda = (s) => ({ animationDelay: `${s}s` })

export default function Beranda() {
  const { nama, usia, tanggalJadian, albums, beranda: B } = content
  const sapaan = useMemo(() => B.sapaan[kunciSapaan(new Date().getHours())], [B])
  const hari = hariBersama(tanggalJadian).toLocaleString('id-ID')

  return (
    <div style={{ padding: 'calc(36px + env(safe-area-inset-top,0px)) 20px 16px' }}>
      <div className="rise">
        <h1 style={{ margin: 0, fontFamily: 'Fraunces,serif', fontWeight: 500, fontSize: 34, lineHeight: 1.2 }}>
          {sapaan}, <em style={{ fontWeight: 400, color: '#FFD9E0' }}>{nama}</em>
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 16, color: 'rgba(255,248,245,.78)' }}>{B.subjudul}</p>
      </div>

      <div className="rise" style={{ marginTop: 24, ...tunda(0.1) }}>
        <div
          className="card"
          style={{
            borderRadius: 20, padding: 24, background: 'linear-gradient(135deg,#33232C,#261A21)',
            border: '1px solid rgba(232,169,160,.35)', display: 'flex', alignItems: 'center', gap: 20,
          }}
        >
          <div className="num" style={{ fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontSize: 84, lineHeight: 1, color: '#F4B6C2' }}>{usia}</div>
          <div>
            <p style={{ margin: 0, fontSize: 14, color: '#E8A9A0' }}>{B.kartuLabel}</p>
            <p style={{ margin: '6px 0 0', fontSize: 16, lineHeight: 1.6, color: '#FFF8F5' }}>{B.kartuTeks}</p>
          </div>
        </div>
      </div>

      <p className="rise" style={{ margin: '12px 0 0 12px', fontFamily: 'Caveat,cursive', fontSize: 24, color: '#E8A9A0', transformOrigin: 'left center', ...tunda(0.2) }}>
        <span style={{ display: 'inline-block', transform: 'rotate(-2deg)', transformOrigin: 'left center' }}>{B.catatan}</span>
      </p>

      <h2 className="rise" style={{ margin: '24px 0 14px', fontFamily: 'Fraunces,serif', fontWeight: 500, fontSize: 24, ...tunda(0.25) }}>{B.judulAlbum}</h2>

      <div
        className="rise no-scrollbar"
        style={{
          display: 'flex', gap: 14, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px',
          scrollbarWidth: 'none', scrollSnapType: 'x mandatory', scrollPaddingLeft: 20, overscrollBehaviorX: 'contain', ...tunda(0.3),
        }}
      >
        {albums.map((a) => {
          const foto = a.cover ?? a.kenangan.find((k) => k.foto)?.foto
          return (
            <Link
              key={a.id}
              to={`/album/${a.id}`}
              aria-label={`Buka album ${a.judul}`}
              className="card"
              style={{ flex: '0 0 140px', scrollSnapAlign: 'start', display: 'block', color: 'inherit', textDecoration: 'none', textAlign: 'left' }}
            >
              {foto ? (
                <FotoLazy src={foto} alt="" style={{ width: 140, height: 140, borderRadius: 16 }} fallback={`linear-gradient(145deg,${a.gradien[0]},${a.gradien[1]})`} />
              ) : (
                <div
                  style={{
                    width: 140, height: 140, borderRadius: 16, background: `linear-gradient(145deg,${a.gradien[0]},${a.gradien[1]})`,
                    display: 'flex', alignItems: 'flex-end', padding: 10, boxSizing: 'border-box',
                  }}
                >
                  <span style={{ fontFamily: 'Caveat,cursive', fontSize: 18, color: 'rgba(26,18,22,.7)' }}>[foto]</span>
                </div>
              )}
              <p style={{ margin: '10px 0 0', fontSize: 16, fontWeight: 600 }}>{a.judul}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,248,245,.7)' }}>{a.kenangan.length} kenangan</p>
            </Link>
          )
        })}
      </div>

      <div className="rise" style={{ marginTop: 32, ...tunda(0.4) }}>
        <div className="card" style={{ borderRadius: 20, padding: 24, background: 'linear-gradient(160deg,#F4B6C2,#E8A9A0)', color: '#1A1216' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{B.bersamaSejak} {tanggalPanjang(tanggalJadian)}</p>
          <p style={{ margin: '8px 0 0', fontFamily: 'Fraunces,serif', fontSize: 56, lineHeight: 1.05, fontWeight: 500 }}>{hari}</p>
          <p style={{ margin: '4px 0 0', fontFamily: 'Fraunces,serif', fontStyle: 'italic', fontSize: 24 }}>{B.hariBersama}</p>
          <svg width="100%" height="24" viewBox="0 0 300 24" preserveAspectRatio="none" fill="none" style={{ marginTop: 16 }} aria-hidden="true">
            <path d="M0 12 Q18 2 37 12 T75 12 T112 12 T150 12 T187 12 T225 12 T262 12 T300 12" stroke="#1A1216" strokeOpacity=".35" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  )
}
