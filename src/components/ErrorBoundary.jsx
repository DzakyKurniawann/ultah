import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Terjadi kesalahan saat menampilkan halaman.', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-dvh flex-col items-center justify-center px-7 text-center text-cream">
          <h1 className="m-0 font-display text-[30px] font-medium">Ups, coba muat ulang ya</h1>
          <p className="mb-5 mt-3 max-w-[32ch] text-sm leading-relaxed text-text2">
            Halaman ini belum berhasil dibuka. Muat ulang untuk mencoba lagi.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-12 rounded-full border-0 bg-pink-soft px-6 font-semibold text-bg"
          >
            Muat ulang
          </button>
        </main>
      )
    }
    return this.props.children
  }
}
