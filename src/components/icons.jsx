// SVG disalin dari design-ref (02-beranda, 04-detail-album)
const dasar = { viewBox: '0 0 24 24', 'aria-hidden': true }
const garis = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IkonBeranda = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}><path d="M4 11l8-7 8 7v9H4z" /></svg>
)
export const IkonAlbum = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}><rect x="4" y="4" width="16" height="16" rx="3" /><circle cx="12" cy="12" r="3.5" /></svg>
)
export const IkonSurat = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
)
export const IkonKejutan = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M12 9v11M4 13h16M12 9c-3-4-6-2-4 0M12 9c3-4 6-2 4 0" />
  </svg>
)
export const IkonPlay = ({ size = 20, ...p }) => (
  <svg width={size} height={size} {...dasar} fill="currentColor" {...p}><path d="M8 5v14l11-7z" /></svg>
)
export const IkonPause = ({ size = 20, ...p }) => (
  <svg width={size} height={size} {...dasar} fill="currentColor" {...p}>
    <rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)
export const IkonKembali = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}><path d="M15 5l-7 7 7 7" /></svg>
)
export const IkonSebelumnya = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}><path d="M11 5L4 12l7 7M20 5v14" /></svg>
)
export const IkonBerikutnya = (p) => (
  <svg width="24" height="24" {...dasar} {...garis} {...p}><path d="M13 5l7 7-7 7M4 5v14" /></svg>
)
export const IkonUlangi = (p) => (
  <svg width="22" height="22" {...dasar} {...garis} {...p}>
    <path d="M3 11a8 8 0 0 1 14-5l2 2M19 3v5h-5M21 13a8 8 0 0 1-14 5l-2-2M5 21v-5h5" />
  </svg>
)

export const IKON_TAB = { beranda: IkonBeranda, album: IkonAlbum, surat: IkonSurat, kejutan: IkonKejutan }
