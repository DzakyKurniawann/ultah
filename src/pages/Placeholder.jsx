import { useLocation } from 'react-router-dom'
import { useKembali } from '../lib/useKembali.js'
import { IkonKembali } from '../components/icons.jsx'
import { cariRute } from '../routes.js'

// Placeholder tahap 1: hanya judul. Diganti halaman asli di tahap berikutnya.
export default function Placeholder() {
  const { pathname } = useLocation()
  const kembali = useKembali('/')
  const rute = cariRute(pathname)

  return (
    <div className="rise" style={{ padding: 'calc(36px + env(safe-area-inset-top,0px)) 20px 16px' }}>
      {!rute.showNav && (
        <button type="button" aria-label="Kembali" onClick={kembali} className="-ml-2.5 mb-2 flex h-11 w-11 items-center justify-center border-0 bg-transparent text-cream">
          <IkonKembali />
        </button>
      )}
      <h1 className="m-0 font-display text-[34px] font-medium leading-[1.2]">{rute.label}</h1>
    </div>
  )
}
