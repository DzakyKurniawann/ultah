import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/caveat/400.css'
import '@fontsource/caveat/600.css'
import '@fontsource/fraunces/400.css'
import '@fontsource/fraunces/500.css'
import '@fontsource/fraunces/400-italic.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import content from './content.js'
import { AudioProvider } from './lib/AudioProvider.jsx'
import './styles.css'

document.title = `Untuk ${content.nama}`
const updateTabVisibility = () => {
  document.documentElement.classList.toggle('is-backgrounded', document.hidden)
}
document.addEventListener('visibilitychange', updateTabVisibility)
updateTabVisibility()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <AudioProvider>
          <App />
        </AudioProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
)
