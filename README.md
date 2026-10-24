# Hadiah ulang tahun

Website React + Vite dengan navigasi `HashRouter`. Teks dan data personal utamanya ada di `src/content.js`; file gambar dan audio yang diakses dengan URL diletakkan di `public/`.

## Panduan teks dan konten

Buka `src/content.js`, lalu ubah nilai yang sudah ada. Pertahankan tanda kutip, koma, kurung, dan nama properti. Teks berpetik tunggal yang mengandung apostrof harus memakai petik ganda atau escape (`\'`).

| Yang ingin diubah | Lokasi di `src/content.js` |
| --- | --- |
| Nama penerima, nama pengirim, usia | Variabel `nama`, `namaPengirim`, dan `usia` di bagian paling atas |
| Tanggal jadian dan kode gerbang | `tanggalJadian`, format `YYYY-MM-DD`; `kodeGerbang` dihitung otomatis sebagai `DDMMYY` |
| Nomor telepon dan tautan WhatsApp | `nomorTelepon` dan `linkWhatsApp` |
| Sapaan, teks beranda, label album | `beranda` dan `halamanAlbum` |
| Judul/artis lagu, teks pemutar, foto di tengah piringan | `lagu` dan `pemutar` |
| Isi surat ulang tahun | `surat`; `bait` adalah daftar bait, setiap bait berupa daftar baris |
| Surat berdasarkan suasana | `bukaSaat.amplop`; setiap amplop punya `id`, `label`, dan `teks` |
| Isi album dan kenangan | `albums`; setiap kenangan punya `judul`, `tanggal`, `caption`, `cerita`, dan `foto` |
| Cerita perjalanan | `timeline.titik` |
| Kartu kejutan, kue, dan penutup | `kejutan`, `kue`, dan `penutup` |

Contoh mengubah satu kenangan:

```js
{
	judul: 'Piknik pertama',
	tanggal: '2024-06-15',
	caption: 'sore di tepi danau',
	cerita: 'Kita membawa bekal dan pulang saat matahari terbenam.',
	foto: 'media/piknik-pertama.webp',
}
```

Tanggal kenangan menggunakan format `YYYY-MM-DD`. Untuk kenangan tanpa foto, gunakan `foto: null`; untuk kenangan yang belum diberi judul atau cerita, nilai `null` yang sudah ada boleh dipertahankan. Data `dummy(...)` menghasilkan kenangan contoh secara otomatis. Ganti pemanggilan itu dengan daftar kenangan sendiri jika tidak ingin menampilkan data contoh.

Beberapa nilai saling terhubung: mengubah `nama`, `namaPengirim`, `usia`, atau `tanggalJadian` akan mengubah teks turunan yang memakai nilai tersebut. Teks seperti judul album, pesan surat, caption, dan cerita diubah langsung pada propertinya.

Mayoritas teks tampilan ada di `src/content.js`. Sebagian label teknis/aksesibilitas dan frasa dekoratif masih ditulis langsung di komponen dalam `src/pages/` atau `src/components/` (misalnya label tombol dan navigasi). Jika teks yang ingin diubah tidak ditemukan di `content.js`, cari teks persisnya di folder `src/`; jangan mengubah komponen untuk mengganti data album atau surat.

Judul tab browser diubah pada elemen `<title>` di `index.html`. Bahasa dokumen, tema browser, dan pengaturan agar halaman tidak diindeks juga berada di file itu; ubah metadata tersebut hanya jika memang ingin mengubah perilaku tersebut.

## Foto dan file media

Folder `public/` adalah tempat file yang perlu dimuat langsung melalui URL. Buat folder `public/media/` untuk foto agar file mudah dikelola; folder ini belum dibuat otomatis, jadi buat foldernya di Explorer VS Code jika diperlukan. Contoh:

```text
public/
	komang.mp3
	media/
		piknik-pertama.webp
		sampul-album.webp
```

Di `src/content.js`, tulis path relatif terhadap `public/`, tanpa awalan `/public/` dan tanpa garis miring di depan:

```js
foto: 'media/piknik-pertama.webp'
```

Cara memasang foto:

1. Salin foto ke `public/media/` dan gunakan nama file sederhana, misalnya `piknik-pertama.webp`.
2. Pada item kenangan yang sesuai, ubah `foto: null` menjadi `foto: 'media/piknik-pertama.webp'`.
3. Untuk sampul album tertentu, tambahkan properti `cover: 'media/sampul-album.webp'` pada objek album. Jika `cover` tidak diisi, sampul otomatis memakai foto kenangan pertama yang tersedia.
4. Untuk foto di pemutar lagu, ubah `lagu.foto` dari `null` menjadi path media yang sama.

Foto dipotong mengikuti bingkainya (`object-fit: cover`), dimuat saat diperlukan, dan menampilkan placeholder jika gagal. Gunakan JPG/JPEG, PNG, atau WebP; WebP biasanya lebih ringan. Kurangi ukuran foto sebelum memasukkannya agar cepat dibuka di ponsel. Huruf besar-kecil nama file harus sama persis dengan path, terutama setelah deploy ke hosting.

Jangan taruh file yang dirujuk dengan path seperti ini di `src/assets/`; path media di atas ditujukan untuk file dalam `public/`. Folder `src/assets/` cocok untuk aset yang di-import langsung dari kode, bukan mekanisme yang dipakai konten foto saat ini.

### Mengganti lagu

Pemutar mengambil audio dari `public/komang.mp3`. Cara termudah adalah mengganti file tersebut dengan audio Anda dan tetap memakai nama `komang.mp3`. Jika ingin mengganti nama atau lokasinya, ubah sumber audio di `src/lib/AudioProvider.jsx` agar sesuai dengan file di `public/` (contoh: `media/lagu-kita.mp3`). Teks judul dan artis lagu tetap diubah terpisah melalui `lagu.judul` dan `lagu.artis` di `src/content.js`.

Format yang saat ini dipasang adalah MP3. Pastikan file benar-benar berekstensi `.mp3`, dapat diputar di browser, dan ukurannya tidak terlalu besar.

## Menjalankan dan memeriksa perubahan

Gunakan Node.js versi yang dicantumkan di `package.json` (`22.23.1`):

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Jalankan `npm run dev`, buka URL lokal yang ditampilkan, lalu periksa halaman terkait. Jika foto tidak muncul, pastikan file berada di `public/`, path di `content.js` ditulis seperti `media/nama-file.webp`, dan ejaan/kapitalisasi cocok. Jika lagu tidak muncul, periksa `public/komang.mp3` dan tab Console/Network di browser.

Build produksi berada di `dist/`. Aplikasi memakai `HashRouter` dan base relatif, sehingga rute seperti `#/surat` bekerja pada hosting statis dan Vercel tanpa rewrite khusus.

## Deploy manual ke Vercel

1. Push repository ke GitHub.
2. Di Vercel, pilih **Add New → Project**, lalu import repository.
3. Beri nama proyek bebas yang tersedia, misalnya `hadiah-ulang-tahun-acak`.
4. Pilih preset **Vite**, Build Command `npm run build`, dan Output Directory `dist`.
5. Deploy, lalu uji Gerbang, lagu, foto, dan tautan di URL hasil deploy.

`index.html` memiliki `noindex,nofollow` dan `public/robots.txt` melarang crawler. Ini membantu mencegah pengindeksan, tetapi bukan pengganti autentikasi atau kontrol akses untuk konten privat.
