import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' + HashRouter: bisa di-host di root maupun subfolder statis.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})