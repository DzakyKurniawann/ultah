import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireGate from './components/RequireGate.jsx'
import { RUTE } from './routes.js'

const Beranda = lazy(() => import('./pages/Beranda.jsx'))
const AlbumDetail = lazy(() => import('./pages/AlbumDetail.jsx'))
const AlbumLibrary = lazy(() => import('./pages/AlbumLibrary.jsx'))
const Gerbang = lazy(() => import('./pages/Gerbang.jsx'))
const KenanganDiputar = lazy(() => import('./pages/KenanganDiputar.jsx'))
const Surat = lazy(() => import('./pages/Surat.jsx'))
const KejutanHub = lazy(() => import('./pages/KejutanHub.jsx'))
const Kue = lazy(() => import('./pages/Kue.jsx'))
const BukaSaat = lazy(() => import('./pages/BukaSaat.jsx'))
const TigaTahun = lazy(() => import('./pages/TigaTahun.jsx'))
const Pemutar = lazy(() => import('./pages/Pemutar.jsx'))
const Penutup = lazy(() => import('./pages/Penutup.jsx'))
const Placeholder = lazy(() => import('./pages/Placeholder.jsx'))
const LAINNYA = RUTE.filter((r) => !['/', '/gerbang', '/album', '/surat', '/kenangan', '/kejutan', '/pemutar', '/penutup'].includes(r.path))

export default function App() {
  return (
    <Suspense fallback={<div className="route-loading" role="status">sebentar, ya…</div>}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/gerbang" element={<Gerbang />} />
          <Route element={<RequireGate />}>
            <Route path="/" element={<Beranda />} />
            {LAINNYA.map((r) => (
              <Route key={r.path} path={r.path} element={<Placeholder />} />
            ))}
            <Route path="/album" element={<AlbumLibrary />} />
            <Route path="/album/:id" element={<AlbumDetail />} />
            <Route path="/surat" element={<Surat />} />
            <Route path="/kejutan" element={<KejutanHub />} />
            <Route path="/kejutan/kue" element={<Kue />} />
            <Route path="/kejutan/buka-saat" element={<BukaSaat />} />
            <Route path="/kejutan/tiga-tahun" element={<TigaTahun />} />
            <Route path="/pemutar" element={<Pemutar />} />
            <Route path="/penutup" element={<Penutup />} />
            <Route path="/kenangan/:albumId/:index" element={<KenanganDiputar />} />
            <Route path="/foto/:albumId/:index" element={<Placeholder />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
