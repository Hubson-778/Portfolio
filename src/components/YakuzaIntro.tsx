import { useEffect, useState } from 'react'

interface YakuzaIntroProps {
  onDone: () => void
}

// Pre-load the font once at module level so it's ready on first click
const edoFont = new FontFace('EdoSZ', `url(${import.meta.env.BASE_URL}fonts/edosz.ttf)`)
edoFont.load().then(f => document.fonts.add(f)).catch(() => {})

export default function YakuzaIntro({ onDone }: YakuzaIntroProps) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    // Desaturate the whole page
    document.documentElement.style.filter = 'grayscale(1) brightness(0.35)'

    const timers = [
      setTimeout(() => setPhase(1), 250),   // lines appear
      setTimeout(() => setPhase(2), 600),   // surname slides in
      setTimeout(() => setPhase(3), 950),   // firstname slides in
      setTimeout(() => setPhase(4), 2300),  // fade out starts
      setTimeout(() => {
        document.documentElement.style.filter = ''
        onDone()
      }, 2900),
    ]

    return () => {
      timers.forEach(clearTimeout)
      document.documentElement.style.filter = ''
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: phase >= 4 ? 0 : 1,
      transition: phase >= 4 ? 'opacity 0.55s ease' : 'none',
      pointerEvents: 'all',
    }}>

      {/* Vignette only — no black fill, page shows through desaturated */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px)',
        pointerEvents: 'none',
      }} />

      {/* Top slash line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: 'calc(50% - 60px)', height: 2, zIndex: 1,
        background: 'linear-gradient(90deg, transparent, #cc0000 15%, #ff2200 50%, #cc0000 85%, transparent)',
        boxShadow: '0 0 16px rgba(200,0,0,0.8)',
        transformOrigin: 'left center',
        transform: phase >= 1 ? 'scaleX(1)' : 'scaleX(0)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'transform 0.22s cubic-bezier(0.2,0,0.1,1), opacity 0.15s ease',
      }} />

      {/* Bottom slash line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: 'calc(50% + 60px)', height: 2, zIndex: 1,
        background: 'linear-gradient(90deg, transparent, #cc0000 15%, #ff2200 50%, #cc0000 85%, transparent)',
        boxShadow: '0 0 16px rgba(200,0,0,0.8)',
        transformOrigin: 'right center',
        transform: phase >= 1 ? 'scaleX(1)' : 'scaleX(0)',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'transform 0.22s cubic-bezier(0.2,0,0.1,1) 0.07s, opacity 0.15s ease 0.07s',
      }} />

      {/* Surname — centred, slides in from right */}
      <div style={{
        position: 'relative', zIndex: 2,
        marginBottom: '0.2em',
        fontFamily: '"EdoSZ", serif',
        fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
        color: '#cc0000',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        textShadow: '0 0 40px rgba(200,0,0,0.6), 2px 2px 0 #000',
        whiteSpace: 'nowrap',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateX(0)' : 'translateX(80px)',
        transition: 'transform 0.3s cubic-bezier(0.15,0,0.2,1), opacity 0.2s ease',
      }}>
        Ambroszkiewicz
      </div>

      {/* First name — centred, slides in from left */}
      <div style={{
        position: 'relative', zIndex: 2,
        fontFamily: '"EdoSZ", serif',
        fontSize: 'clamp(1.6rem, 4vw, 3.8rem)',
        color: '#cc0000',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textShadow: '0 0 30px rgba(200,0,0,0.6), 2px 2px 0 #000',
        whiteSpace: 'nowrap',
        opacity: phase >= 3 ? 1 : 0,
        transform: phase >= 3 ? 'translateX(0)' : 'translateX(-80px)',
        transition: 'transform 0.3s cubic-bezier(0.15,0,0.2,1), opacity 0.2s ease',
      }}>
        Hubert
      </div>
    </div>
  )
}
