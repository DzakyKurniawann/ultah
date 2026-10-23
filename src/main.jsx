import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import content from './content.js'
import { AudioProvider } from './lib/AudioProvider.jsx'
import './styles.css'

document.title = `Untuk ${content.nama}`

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AudioProvider>
        <App />
      </AudioProvider>
    </HashRouter>
  </StrictMode>,
)
