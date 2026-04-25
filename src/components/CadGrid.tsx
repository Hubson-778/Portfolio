import type { WorkItem, LightboxState } from '../types'

interface CadGridProps {
  items: WorkItem[]
  onLightbox: (s: LightboxState) => void
}

export default function CadGrid({ items, onLightbox }: CadGridProps) {
  return (
    <div className="cad-grid-inner">
      {items.map(item => {
        const drawings = item.drawings ?? []
        const left     = drawings[0]
        const right    = drawings[1]

        return (
          <div key={item.id} className="cad-row-layout">
            {left && (
              <button className="img-card cad-img" onClick={() => onLightbox({ src: left, alt: `${item.alt} drawing 1` })} aria-label={`${item.alt} drawing 1`}>
                <img src={left} alt={`${item.alt} drawing 1`} loading="lazy" />
              </button>
            )}
            <button className="img-card cad-img cad-render" onClick={() => onLightbox({ src: item.src, alt: item.alt })} aria-label={item.alt}>
              <img src={item.thumb} alt={item.alt} loading="lazy" />
            </button>
            {right && (
              <button className="img-card cad-img" onClick={() => onLightbox({ src: right, alt: `${item.alt} drawing 2` })} aria-label={`${item.alt} drawing 2`}>
                <img src={right} alt={`${item.alt} drawing 2`} loading="lazy" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
