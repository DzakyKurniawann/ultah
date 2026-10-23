import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// kembali satu langkah riwayat; kalau halaman dibuka langsung, pakai rute cadangan
export function useKembali(cadangan) {
  const navigate = useNavigate()
  const { key } = useLocation()
  return useCallback(() => {
    if (key !== 'default') navigate(-1)
    else navigate(cadangan, { replace: true })
  }, [navigate, key, cadangan])
}
