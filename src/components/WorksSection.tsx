import { useState } from 'react'
import PosterGrid from './PosterGrid'
import CadGrid from './CadGrid'
import Lightbox from './Lightbox'
import { illustrations, cadWorks } from '../data/works'
import type { LightboxState } from '../types'

const W = { maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }

export default function WorksSection() {
  const [lightbox, setLightbox] = useState<LightboxState>({ src: null, alt: '' })

  return (
    <>
      {/* ── Posters ── */}
      <section id="posters" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div style={W}>
          <div className="reveal" style={{ marginBottom: '0.75rem' }}>
            <p className="label">Posters</p>
          </div>
          <div className="divider reveal" style={{ marginBottom: '1rem' }} />
          <div className="reveal" style={{ marginBottom: '1.5rem' }}>
            <p className="hint">Click a series to expand all variants</p>
          </div>
          <div className="reveal">
            <PosterGrid items={illustrations} onLightbox={setLightbox} />
          </div>
        </div>
      </section>

      {/* ── CAD ── */}
      <section id="cad" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={W}>
          <div className="reveal" style={{ marginBottom: '0.75rem' }}>
            <p className="label">CAD Projects</p>
          </div>
          <div className="divider reveal" style={{ marginBottom: '1rem' }} />
          <div className="reveal" style={{ marginBottom: '1.5rem' }}>
            <p className="hint">Click an image to enlarge</p>
          </div>
          <div className="reveal">
            <CadGrid items={cadWorks} onLightbox={setLightbox} />
          </div>
        </div>
      </section>

      <Lightbox state={lightbox} onClose={() => setLightbox({ src: null, alt: '' })} />
    </>
  )
}
