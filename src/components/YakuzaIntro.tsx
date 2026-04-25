import { useEffect, useState } from 'react'

interface YakuzaIntroProps {
  onDone: () => void
}

/*
  Sequence:
  0ms   — overlay appears, screen goes B&W
  200ms — red horizontal lines flash in
  500ms — surname slams in from right
  800ms — first name slams in from left
  1200ms— hold
  2200ms— everything fades out
  2600ms— done
*/

export default function YakuzaIntro({ onDone }: YakuzaIntroProps) {
  const [phase, setPhase] = useState(0)

  // Load Edo SZ via FontFace API — handles base path correctly on GitHub Pages
  useEffect(() => {
    const font = new FontFace('EdoSZ', `url(${import.meta.env.BASE_URL}fonts/edosz.ttf)`)
    font.load().then(f => document.fonts.add(f)).catch(() => {})
  }, [])

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 850),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => { onDone() }, 2600),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      opacity: phase >= 4 ? 0 : 1,
      transition: phase >= 4 ? 'opacity 0.55s ease' : 'none',
      pointerEvents: 'all',
    }}>

      {/* Scanline texture */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)',
        pointerEvents: 'none',
      }} />

      {/* Red horizontal slash lines */}
      {phase >= 1 && (
        <>
          <div style={{
            position: 'absolute', left: 0, right: 0,
            height: 3, background: '#cc0000',
            top: '42%', zIndex: 2,
            transform: phase >= 1 ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.18s ease-out',
            boxShadow: '0 0 12px rgba(200,0,0,0.8)',
          }} />
          <div style={{
            position: 'absolute', left: 0, right: 0,
            height: 3, background: '#cc0000',
            top: '58%', zIndex: 2,
            transform: phase >= 1 ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'right',
            transition: 'transform 0.18s ease-out 0.06s',
            boxShadow: '0 0 12px rgba(200,0,0,0.8)',
          }} />
        </>
      )}

      {/* Surname — slams in from right */}
      <div style={{
        position: 'absolute', zIndex: 3,
        top: '44%',
        right: phase >= 2 ? '8%' : '-100%',
        transition: phase >= 2 ? 'right 0.22s cubic-bezier(0.2,0,0.3,1)' : 'none',
        fontFamily: '"EdoSZ", serif',
        fontSize: 'clamp(2.8rem, 7vw, 6rem)',
        fontWeight: 900,
        color: '#cc0000',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        textShadow: '0 0 30px rgba(200,0,0,0.6), 2px 2px 0 #000',
        whiteSpace: 'nowrap',
      }}>
        Ambroszkiewicz
      </div>

      {/* First name — slams in from left */}
      <div style={{
        position: 'absolute', zIndex: 3,
        bottom: '38%',
        left: phase >= 3 ? '8%' : '-100%',
        transition: phase >= 3 ? 'left 0.22s cubic-bezier(0.2,0,0.3,1)' : 'none',
        fontFamily: '"EdoSZ", serif',
        fontSize: 'clamp(2rem, 5vw, 4.2rem)',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        textShadow: '0 0 20px rgba(255,255,255,0.3), 2px 2px 0 #000',
        whiteSpace: 'nowrap',
      }}>
        Hubert
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
