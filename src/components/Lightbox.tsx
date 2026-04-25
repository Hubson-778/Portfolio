import { useEffect } from 'react'
import type { LightboxState } from '../types'

interface LightboxProps {
  state: LightboxState
  onClose: () => void
}

export default function Lightbox({ state, onClose }: LightboxProps) {
  useEffect(() => {
    if (!state.src) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.src, onClose])

  if (!state.src) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={state.alt}>
      <div className="lightbox-bg" onClick={onClose} />
      <img src={state.src} alt={state.alt} />
      <button className="lightbox-close" onClick={onClose} aria-label="Close">✕</button>
    </div>
  )
}
