export default function HeroSection() {
  return (
    <section id="top" style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.25rem 2.5rem' }}>
      <div className="reveal">
        <h1 className="font-serif g-text" style={{ fontSize: 'clamp(2.6rem, 10vw, 8.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '1.25rem' }}>
          Hubert<br />Ambroszkiewicz
        </h1>
        <p className="body-muted" style={{ fontSize: 'clamp(0.9rem, 3vw, 1rem)', marginBottom: '2rem' }}>
          Graphic designer &amp; student based in Gdańsk, Poland.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
          <a href="#posters" className="muted-link">VIEW WORKS ↓</a>
          <a href="#contact" className="muted-link">GET IN TOUCH ↓</a>
        </div>
      </div>
      <div className="divider reveal" />
    </section>
  )
}
