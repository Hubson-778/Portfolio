import { useEffect, useState } from 'react'
import type { Theme } from '../types'

interface NavProps {
  theme: Theme
  onToggleTheme: () => void
}

const W = { maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }

export default function Nav({ theme, onToggleTheme }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route-style anchor click
  const close = () => setOpen(false)

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', paddingBottom: '1rem' }}>
        <a href="#top" className="nav-name" onClick={close}>Hubert Ambroszkiewicz</a>

        {/* Desktop links */}
        <div className="nav-desktop">
          <a href="#posters" className="muted-link">Posters</a>
          <a href="#cad"     className="muted-link">CAD</a>
          <a href="#about"   className="muted-link">About</a>
          <a href="#contact" className="muted-link">Contact</a>
          <button onClick={onToggleTheme} aria-label="Toggle theme" className="theme-btn">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Mobile right side */}
        <div className="nav-mobile-row">
          <button onClick={onToggleTheme} aria-label="Toggle theme" className="theme-btn">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button
            className="hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`ham-line ${open ? 'open' : ''}`} />
            <span className={`ham-line ${open ? 'open' : ''}`} />
            <span className={`ham-line ${open ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${open ? 'open' : ''}`}>
        <a href="#posters" className="muted-link" onClick={close}>Posters</a>
        <a href="#cad"     className="muted-link" onClick={close}>CAD</a>
        <a href="#about"   className="muted-link" onClick={close}>About</a>
        <a href="#contact" className="muted-link" onClick={close}>Contact</a>
      </div>
    </nav>
  )
}
