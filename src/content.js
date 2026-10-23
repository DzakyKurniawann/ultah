// ============================================================
// SATU-SATUNYA FILE KONTEN. Ganti nama, tanggal, teks, dan foto di sini.
// Komponen tidak boleh menulis teks/angka konten secara langsung.
// ============================================================

const nama = 'Nadira'
const namaPengirim = 'Raka'
const tanggalJadian = '2023-10-23' // format YYYY-MM-DD
const usia = 19

// kode gerbang = DDMMYY dari tanggalJadian
const hitungKode = (iso) => iso.slice(8, 10) + iso.slice(5, 7) + iso.slice(2, 4)

// pembuat kenangan dummy (isi sungguhan nanti); foto: null => placeholder "[foto]"
const dummy = (awalan, jumlah, tahun) =>
  Array.from({ length: jumlah }, (_, i) => ({
    judul: `${awalan} ${i + 1}`,
    tanggal: `${tahun + Math.floor(i / 6)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    caption: `${awalan.toLowerCase()} ${i + 1}`,
    cerita: 'Cerita untuk kenangan ini akan diisi nanti.',
    foto: null,
  }))

const masaSma = [
  { judul: 'Pulang bareng lewat jalan belakang', tanggal: '2023-10-28', caption: 'kelas 12, sore itu',
    cerita: 'Dulu jalan pulang itu terasa pendek, karena kamu ada di sebelahku. Sekarang aku baru sadar: bukan jalannya yang pendek, tapi waktu yang berhenti kalau bersamamu.', foto: null },
  { judul: 'Kantin jam istirahat kedua', tanggal: '2023-11-15', caption: 'kantin', cerita: 'Cerita akan diisi nanti.', foto: null },
  { judul: 'Hujan, satu payung berdua', tanggal: '2024-02-09', caption: 'hujan, satu payung berdua', cerita: 'Cerita akan diisi nanti.', foto: null },
  { judul: 'Nunggu bel pulang', tanggal: '2024-04-22', caption: 'nunggu bel', cerita: 'Cerita akan diisi nanti.', foto: null },
  { judul: 'Bangku paling belakang', tanggal: '2024-09-05', caption: 'bangku belakang', cerita: 'Cerita akan diisi nanti.', foto: null },
  { judul: 'Foto di tangga sekolah', tanggal: '2025-03-13', caption: 'tangga sekolah', cerita: 'Cerita akan diisi nanti.', foto: null },
  // "Yang belum sempat diberi judul": judul null, caption boleh null
  { judul: null, tanggal: '2023-12-01', caption: 'bangku belakang', cerita: null, foto: null },
  { judul: null, tanggal: '2024-01-12', caption: null, cerita: null, foto: null },
  { judul: null, tanggal: '2024-05-20', caption: null, cerita: null, foto: null },
  { judul: null, tanggal: '2024-08-03', caption: 'pulang, hujan', cerita: null, foto: null },
  { judul: null, tanggal: '2024-11-18', caption: 'tangga sekolah', cerita: null, foto: null },
  { judul: null, tanggal: '2025-01-25', caption: null, cerita: null, foto: null },
]

const content = {
  nama,
  namaPengirim,
  tanggalJadian,
  usia,
  nomorTelepon: '+6281234567890', // dummy
  kodeGerbang: hitungKode(tanggalJadian),

  gerbang: {
    salam: `Untuk ${nama}`,
    judulAwal: 'Ada sesuatu yang dibuat',
    judulPenekanan: 'khusus untukmu',
    subteks: 'Masukkan tanggal hari spesialmu untuk membukanya.',
    petunjuk: 'petunjuk: hari-bulan-tahun, enam angka',
    pesanSalah: [
      'Hmm, bukan yang itu. Coba ingat hari yang paling kamu sayang.',
      'Belum pas, sayang. Ingat hari pertama kita jadi kita.',
      'Hampir… coba tanya hatimu, bukan kalender.',
    ],
    sambutan: `Selamat datang, ${nama}`,
    sambutanKecil: 'Sebentar ya, kami buka lagunya…',
  },

  beranda: {
    sapaan: { pagi: 'Selamat pagi', siang: 'Selamat siang', sore: 'Selamat sore', malam: 'Selamat malam' },
    subjudul: 'Dibuat khusus untukmu',
    kartuLabel: 'Hari spesialmu',
    kartuTeks: 'Satu tahun lagi kamu tumbuh, dan aku masih di sini.',
    catatan: 'ini baru permulaan',
    judulAlbum: 'Album kita',
    bersamaSejak: 'Bersama sejak',
    hariBersama: 'hari bersama',
  },

  satuanKenangan: 'kenangan',

  halamanAlbum: {
    judulAwal: 'Album',
    judulPenekanan: 'kita',
    subjudul: 'lima rasa, satu cerita: kita',
    tanpaJudul: 'Yang belum sempat diberi judul',
  },

  foto: {
    sambung: 'dari',
    petunjuk: 'geser ke kiri atau kanan',
  },

  lagu: {
    judul: 'Komang',
    artis: 'Raim Laode',
    barisPemutar: [
      'Ini lagu kita, dan akan selalu begitu.',
      'Setiap kali diputar, aku ingat kamu.',
      'Pejamkan mata. Kita masih di tepi laut itu.',
    ],
  },

  // urutan mengikuti carousel Beranda (02). gradien = [awal, akhir]
  albums: [
    { id: 'masa-sma', judul: 'Masa SMA', subjudul: 'pulang bareng, tak pernah terasa jauh',
      deskripsi: 'Seragam yang sama, jalan pulang yang sama, dan kamu di sebelahku. Dulu kita tak sadar, itu yang paling mewah.',
      gradien: ['#F4B6C2', '#E8A9A0'], kenangan: masaSma },
    { id: 'cuma-ngobrol', judul: 'Cuma Ngobrol', subjudul: 'berjam-jam, tentang apa saja',
      deskripsi: 'Deskripsi album akan diisi nanti.',
      gradien: ['#FFD9E0', '#F4B6C2'], kenangan: dummy('Obrolan', 8, 2023) },
    { id: 'jalan-jalan-kita', judul: 'Jalan-jalan Kita', subjudul: 'ke mana pun, asal bareng',
      deskripsi: 'Deskripsi album akan diisi nanti.',
      gradien: ['#E8A9A0', '#C98A86'], kenangan: dummy('Perjalanan', 10, 2023) },
    { id: 'laut', judul: 'Laut', subjudul: 'asal ada ombak dan kamu',
      deskripsi: 'Deskripsi album akan diisi nanti.',
      dekorasi: 'ombak', // kartu Laut: ombak SVG di daftar album
      gradien: ['#8EC5D1', '#F4B6C2'], kenangan: dummy('Ombak', 9, 2024) },
    { id: 'hari-biasa', judul: 'Hari Biasa', subjudul: 'biasa, tapi paling kangen',
      deskripsi: 'Deskripsi album akan diisi nanti.',
      gradien: ['#FFF8F5', '#E8A9A0'], kenangan: dummy('Hari', 7, 2024) },
  ],

  surat: {
    keterangan: 'ditulis tangan, hanya untukmu',
    judul: `Untuk ${nama}, di hari ke-${usia}-mu`,
    // array bait; tiap bait = array baris (jeda antar bait di mode lirik)
    bait: [
      [`${nama},`, 'Hari ini usiamu sembilan belas.', 'Dari semua hal besar yang bisa terjadi dalam hidupku,', 'yang paling kusyukuri justru yang paling sederhana:', 'kamu yang tersenyum saat aku bercerita, bahkan ketika ceritanya tidak penting.'],
      ['Kita pernah punya masa di mana semua tempat terasa dekat,', 'karena ke mana pun kakiku melangkah, kamu ada di sampingku.', 'Sekarang jarak menjadikan layar jendela kecil kita.', 'Tapi lihatlah, tiga tahun berlalu dan jendela itu tidak pernah kehabisan cahaya.'],
      ['Laut tidak pernah memilih ombak mana yang kembali ke pantai.', 'Ia hanya kembali, terus, tanpa lelah.', 'Begitu juga aku.'],
      ['Selamat ulang tahun, sayangku.', 'Terima kasih sudah jadi rumah untuk semua ceritaku.'],
    ],
    tandaTangan: `— ${namaPengirim}`,
    catatanAkhir: 'dibaca sampai habis, ya.',
  },

  bukaSaat: {
    pengantar: 'Surat kecil untuk setiap perasaanmu. Ketuk satu amplop untuk membukanya.',
    amplop: [
      { id: 'kangen', label: 'Buka saat kamu kangen',
        teks: 'Kangen itu tanda bahwa yang kita punya itu nyata. Pejamkan mata, putar lagu kita, dan ingat: aku sedang menghitung hari untuk bertemu.',
        warna: { amplop: '#FFF8F5', tutup: '#FFD9E0', dalam: '#E8A9A0' }, miring: -2 },
      { id: 'sedih', label: 'Buka saat kamu sedih',
        teks: 'Kamu selalu baik ke semua orang, bahkan saat kamu sendiri lelah. Hari ini biarkan aku yang baik padamu. Ceritakan semuanya, aku dengarkan sampai selesai.',
        warna: { amplop: '#FFD9E0', tutup: '#F4B6C2', dalam: '#E8A9A0' }, miring: 1.6 },
      { id: 'cerita', label: 'Buka saat kamu mau cerita',
        teks: 'Ketuk tombol telepon. Aku di sini.', aksi: 'telepon',
        warna: { amplop: '#E8A9A0', tutup: '#FFD9E0', dalam: '#F4B6C2' }, miring: -1 },
    ],
  },

  timeline: {
    pengantar: 'Enam titik kecil di antara ribuan hari. Semuanya tentang kita.',
    titik: [
      { tanggal: '14 Jul 2023', judul: 'Kenalan', cerita: 'Awalnya cuma saling sapa di lorong. Siapa sangka itu awal segalanya.' },
      { tanggal: '23 Okt 2023', judul: 'Jadian', cerita: 'Kamu bilang iya sambil menunduk malu. Aku pulang dengan senyum yang susah hilang.' },
      { tanggal: '23 Okt 2024', judul: 'Tahun pertama', cerita: 'Satu tahun, ribuan obrolan, dan satu lagu yang diam-diam jadi milik kita.' },
      { tanggal: 'Mei 2025', judul: 'Masa SMA berakhir', cerita: 'Seragam dilipat, tapi kenangannya tidak ikut disimpan di lemari.' },
      { tanggal: 'Agu 2025', judul: 'Mulai LDR', cerita: 'Jarak mulai ikut bicara, tapi rindu kita selalu lebih keras suaranya.' },
      { tanggal: '23 Okt 2026', judul: `Hari ini: ${usia}`, cerita: 'Usiamu bertambah, sayangku ikut bertambah. Selamat ulang tahun.', hariIni: true },
    ],
    penutup: 'Bab berikutnya: kita yang tulis',
    penutupKecil: 'Halaman kosong ini milik kita berdua.',
  },

  kue: {
    pesan: {
      pembuka: `Selamat ulang tahun, ${nama}. Permintaanmu sudah kucatat.`,
      penekanan: 'Sebagian akan kuwujudkan, sebagian lagi kita wujudkan berdua.',
      tandaTangan: `— ${namaPengirim}`,
    },
  },

  penutup: {
    judul: 'Selamat ulang tahun, sayang.',
    baris: 'Ini baru satu lagu dari banyak lagu kita.',
    tandaTangan: `— ${namaPengirim}`,
  },
}

export default content
