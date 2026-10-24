import { Link } from 'react-router-dom'
import content from '../content.js'
import { IkonPlay, IkonUlangi } from '../components/icons.jsx'
import { useAudio } from '../lib/AudioContext.js'

export default function Penutup() {
  const { playing, audioError, toggle, restart } = useAudio()
  const penutup = content.penutup

  return (
    <section className="closing-screen">
      <div className="closing-toast" role="status">
        <span className={`closing-equalizer ${playing ? 'is-playing' : ''}`} aria-hidden="true"><i /><i /><i /></span>
        {playing ? content.penutup.memutar : content.penutup.dijeda}
      </div>

      <div className="closing-message">
        <p>{penutup.judul}</p>
        <p>{penutup.baris}</p>
        <span>{penutup.tandaTangan}</span>
      </div>

      <div className="closing-actions">
        <button type="button" className="closing-primary" onClick={restart}>
          <IkonUlangi />
          {content.penutup.putarUlang}
        </button>
        <button type="button" className="closing-secondary" onClick={toggle}>
          {playing ? 'Jeda Komang' : 'Putar Komang'}
        </button>
        {audioError && <p role="status">{content.pemutar.audioTidakTersedia}</p>}
        <Link to="/pemutar" className="closing-player-link">
          {content.pemutar.judul} <IkonPlay size={16} />
        </Link>
      </div>
    </section>
  )
}
