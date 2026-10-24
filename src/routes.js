// Konfigurasi per rute: tampilkan mini player / bottom nav atau tidak.
export const RUTE = [
  { path: '/gerbang', label: 'Gerbang', tab: false, showMini: false, showNav: false },
  { path: '/', label: 'Beranda', ikon: 'beranda', tab: true, showMini: true, showNav: true },
  { path: '/album', label: 'Album', ikon: 'album', tab: true, showMini: true, showNav: true },
  { path: '/surat', label: 'Surat', ikon: 'surat', tab: true, showMini: false, showNav: true },
  { path: '/kejutan', label: 'Kejutan', ikon: 'kejutan', tab: true, showMini: true, showNav: true },
  { path: '/foto', label: 'Foto', tab: false, showMini: false, showNav: false },
  { path: '/kenangan', label: 'Kenangan', tab: false, showMini: false, showNav: false },
  { path: '/pemutar', label: 'Pemutar', tab: false, showMini: false, showNav: false },
  { path: '/penutup', label: 'Penutup', tab: false, showMini: false, showNav: false },
]

export function cariRute(pathname) {
  return (
    RUTE.find((r) => pathname === r.path || (r.path !== '/' && pathname.startsWith(r.path + '/'))) ?? {
      label: '', showMini: false, showNav: false,
    }
  )
}
