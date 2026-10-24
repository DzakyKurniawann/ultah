import { Link } from 'react-router-dom'
import content from '../content.js'

function IlustrasiKartu({ jenis }) {
  if (jenis === 'kue') {
    return (
      <svg viewBox="0 0 120 100" className="h-[100px] w-[120px]" fill="none" aria-hidden="true">
        <ellipse cx="60" cy="83" rx="39" ry="6" fill="#1A1216" opacity=".35" />
        <path d="M28 53h64v24a7 7 0 0 1-7 7H35a7 7 0 0 1-7-7V53Z" fill="#FFF8F5" />
        <path d="M28 59c7 7 12-6 19 0s12-6 19 0 12-6 19 0 12-6 19 0v8H28v-8Z" fill="#F4B6C2" />
        <ellipse cx="60" cy="53" rx="32" ry="9" fill="#FFD9E0" />
        <path d="M49 44V28m22 16V25" stroke="#FFF8F5" strokeWidth="5" strokeLinecap="round" />
        <path d="M49 24c-6-7 5-9 0-16m22 14c-6-7 5-9 0-16" stroke="#F4B6C2" strokeWidth="3" strokeLinecap="round" />
        <path d="M49 12c-5 5-2 9 0 10 3-3 4-7 0-10Zm22-2c-5 5-2 9 0 10 3-3 4-7 0-10Z" fill="#FFD9E0" />
      </svg>
    )
  }

  if (jenis === 'surat') {
    return (
      <svg viewBox="0 0 120 100" className="h-[100px] w-[120px]" fill="none" aria-hidden="true">
        <path d="M25 35a6 6 0 0 1 6-6h58a6 6 0 0 1 6 6v43H25V35Z" fill="#FFF8F5" />
        <path d="m25 39 35 25 35-25v37H25V39Z" fill="#F4B6C2" />
        <path d="m25 39 35 25 35-25" stroke="#E8A9A0" strokeWidth="2" />
        <path d="M48 37c0-6 4-10 10-10 5 0 8 4 8 8 0 6-8 11-8 11s-10-4-10-9Z" fill="#E8A9A0" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 120 100" className="h-[100px] w-[120px]" fill="none" aria-hidden="true">
      <path d="M20 77h80" stroke="#E8A9A0" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 67V48m29 19V31m29 36V43" stroke="#F4B6C2" strokeWidth="3" strokeLinecap="round" />
      <circle cx="31" cy="42" r="7" fill="#FFF8F5" stroke="#E8A9A0" strokeWidth="2" />
      <circle cx="60" cy="24" r="7" fill="#FFD9E0" stroke="#E8A9A0" strokeWidth="2" />
      <circle cx="89" cy="37" r="7" fill="#FFF8F5" stroke="#E8A9A0" strokeWidth="2" />
      <path d="M45 83c9-7 21-7 30 0" stroke="#F4B6C2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function KejutanHub() {
  const kejutan = content.kejutan

  return (
    <section className="rise px-5 pb-6 pt-[calc(36px+env(safe-area-inset-top,0px))]">
      <p className="mb-2 mt-0 font-hand text-[22px] text-rose-gold">ada sesuatu untukmu</p>
      <h1 className="m-0 font-display text-[34px] font-medium leading-tight">{kejutan.judul}</h1>
      <p className="mb-6 mt-2 text-[14px] text-text2">{kejutan.subjudul}</p>

      <div className="grid gap-3">
        {kejutan.kartu.map((kartu, index) => (
          <Link
            key={kartu.rute}
            to={kartu.rute}
            className="card flex min-h-[142px] items-center justify-between overflow-hidden rounded-[22px] border border-line bg-surface px-4 py-3 no-underline"
          >
            <div className="min-w-0 pr-2">
              <span className="mb-2 block text-[11px] tracking-[.16em] text-rose-gold">0{index + 1}</span>
              <h2 className="m-0 font-display text-[23px] font-medium leading-tight text-cream">{kartu.judul}</h2>
              <p className="mb-0 mt-2 text-[12px] leading-relaxed text-text2">{kartu.deskripsi}</p>
            </div>
            <IlustrasiKartu jenis={['kue', 'surat', 'waktu'][index]} />
          </Link>
        ))}
      </div>
    </section>
  )
}
