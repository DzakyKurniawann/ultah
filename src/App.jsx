import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireGate from './components/RequireGate.jsx'
import Beranda from './pages/Beranda.jsx'
import Gerbang from './pages/Gerbang.jsx'
import Placeholder from './pages/Placeholder.jsx'
import { RUTE } from './routes.js'

const LAINNYA = RUTE.filter((r) => !['/', '/gerbang'].includes(r.path))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/gerbang" element={<Gerbang />} />
        <Route element={<RequireGate />}>
          <Route path="/" element={<Beranda />} />
          {LAINNYA.map((r) => (
            <Route key={r.path} path={r.path} element={<Placeholder />} />
          ))}
          <Route path="/album/:id" element={<Placeholder />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
