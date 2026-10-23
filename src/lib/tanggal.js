const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

// kunci sapaan: <11 pagi, <15 siang, <18 sore, selain itu malam
export function kunciSapaan(jam) {
  return jam < 11 ? 'pagi' : jam < 15 ? 'siang' : jam < 18 ? 'sore' : 'malam'
}

// iso 'YYYY-MM-DD' -> '23 Oktober 2023'
export function tanggalPanjang(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${BULAN[m - 1]} ${y}`
}

// selisih hari kalender (UTC, seperti di desain)
export function hariBersama(iso, now = new Date()) {
  const [y, m, d] = iso.split('-').map(Number)
  const sekarang = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((sekarang - Date.UTC(y, m - 1, d)) / 864e5)
}

const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// '2023-10-28' -> '28 Okt 2023'
export function tanggalPendek(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${BULAN_PENDEK[m - 1]} ${y}`
}

// rentang tahun dari array kenangan -> '2023–2025' (atau satu tahun)
export function rentangTahun(kenangan) {
  const th = kenangan.map((k) => Number(k.tanggal.slice(0, 4))).filter(Boolean)
  if (!th.length) return ''
  const a = Math.min(...th)
  const b = Math.max(...th)
  return a === b ? `${a}` : `${a}–${b}`
}
