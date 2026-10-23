import { Navigate, Outlet } from 'react-router-dom'
import { sudahLolos } from '../lib/gerbang.js'

export default function RequireGate() {
  return sudahLolos() ? <Outlet /> : <Navigate to="/gerbang" replace />
}
