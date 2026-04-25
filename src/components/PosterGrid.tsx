import { useState, useEffect, useRef } from 'react'
import type { WorkItem, LightboxState } from '../types'

interface PosterGridProps {
  items: WorkItem[]
  onLightbox: (s: LightboxState) => void
}

export default function PosterGrid({ items, onLightbox }: PosterGridProps) {
  const [activeId, setActiveId]   = useState<string | null>(null)
  const [visible, setVisible]     = useState(false)
  const [selected, setSelected]   = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const prevId   = useRef<string | null>(null)
  const scrollY  = useRef(0)
  const touchX   = useRef<number | null>(null)

  const lockScroll = () => {
    scrollY.current = window.scrollY
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.height   = '100%'
  }

  const unlockScroll = () => {
    document.documentElement.style.overflow = ''
    document.documentElement.style.height   = ''
  }

  const open = (item: WorkItem) => {
    if (!item.variants?.length) { onLightbox({ src: item.src, alt: item.alt }); return }
    setSelected(0); setImgLoaded(false); setActiveId(item.id)
  }

  const close = () => {
    setVisible(false)
    unlockScroll()
    setTimeout(() => setActiveId(null), 350)
  }

  useEffect(() => {
    if (activeId && activeId !== prevId.current) {
      prevId.current = activeId
      lockScroll()
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
    }
    return () => { if (!activeId) unlockScroll() }  }, [activeId])

  const activeItem = items.find(i => i.id === activeId)
  const allSrcs    = activeItem ? [activeItem.src, ...(activeItem.variants ?? [])] : []

  const selectVariant = (i: number) => { if (i === selected) return; setImgLoaded(false); setSelected(i) }
  const prev = () => selectVariant(Math.max(selected - 1, 0))
  const next = () => selectVariant(Math.min(selected + 1, allSrcs.length - 1))

  useEffect(() => {
    if (!activeId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeId, selected])

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    touchX.current = null
  }

  return (
    <>
      <div className={`poster-grid ${activeId ? 'has-open' : ''}`}>
        {items.map(item => (
          <button key={item.id} className={`img-card trigger ${activeId === item.id ? 'active' : ''}`}
            onClick={() => open(item)} aria-expanded={activeId === item.id} aria-label={item.alt}>
            <img src={item.thumb} alt={item.alt} loading="lazy" />
          </button>
        ))}
      </div>

      {activeItem && (
        <div
          className="poster-overlay"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'fixed', inset: 0, zIndex: 80,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(0.75rem, 4vw, 2rem)',
            overflow: 'hidden',
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'all' : 'none',
            transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Backdrop */}
          <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(39,0,93,0.92)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }} />

          {/* Close */}
          <button onClick={close} aria-label="Close" style={{
            position: 'absolute', top: '1rem', right: '1rem', zIndex: 3,
            background: 'none', border: '1px solid rgba(174,210,255,0.3)',
            borderRadius: '50%', width: 44, height: 44,
            cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>

          {/* Title */}
          <div style={{ position: 'relative', zIndex: 2, marginBottom: '0.75rem', textAlign: 'center',
            transform: visible ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1) 0.05s' }}>
            <p className="label" style={{ marginBottom: '0.2rem' }}>{activeItem.alt}</p>
          </div>

          {/* Image + arrows */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 2vw, 1rem)',
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
            transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s' }}>

            <button onClick={prev} disabled={selected === 0} aria-label="Previous" style={{
              background: 'none', border: '1px solid rgba(174,210,255,0.25)', borderRadius: '50%',
              width: 44, height: 44, flexShrink: 0, cursor: selected === 0 ? 'default' : 'pointer',
              color: selected === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)',
              fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>‹</button>

            <button className="img-card"
              onClick={() => onLightbox({ src: allSrcs[selected], alt: `${activeItem.alt}${selected === 0 ? '' : ` variant ${selected}`}` })}
              style={{ background: 'none', border: 'none', padding: 0 }}>
              <img key={allSrcs[selected]} src={allSrcs[selected]} alt={activeItem.alt}
                onLoad={() => setImgLoaded(true)}
                style={{
                  maxHeight: 'clamp(50vh, 62vh, 72vh)',
                  maxWidth:  'clamp(60vw, 72vw, 82vw)',
                  objectFit: 'contain', borderRadius: 6,
                  opacity:   imgLoaded ? 1 : 0,
                  transform: imgLoaded ? 'scale(1)' : 'scale(0.97)',
                  transition: 'opacity 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  boxShadow: '0 24px 56px rgba(0,0,0,0.6), 0 6px 18px rgba(148,0,255,0.3)',
                }} />
            </button>

            <button onClick={next} disabled={selected === allSrcs.length - 1} aria-label="Next" style={{
              background: 'none', border: '1px solid rgba(174,210,255,0.25)', borderRadius: '50%',
              width: 44, height: 44, flexShrink: 0,
              cursor: selected === allSrcs.length - 1 ? 'default' : 'pointer',
              color: selected === allSrcs.length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)',
              fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>›</button>
          </div>

          {/* Purple animated dots only */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '8px', marginTop: '1.25rem', alignItems: 'center' }}>
            {allSrcs.map((_, i) => (
              <button key={i} onClick={() => selectVariant(i)} aria-label={`Go to ${i + 1}`} style={{
                background: 'none', border: 'none', padding: '6px 3px', cursor: 'pointer',
              }}>
                <span style={{
                  display: 'block',
                  width:  i === selected ? 24 : 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: i === selected ? '#9400FF' : 'rgba(174,210,255,0.3)',
                  boxShadow: i === selected ? '0 0 8px rgba(148,0,255,0.7)' : 'none',
                  transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background-color 0.3s ease, box-shadow 0.3s ease',
                }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
