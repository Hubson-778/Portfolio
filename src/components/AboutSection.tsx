export default function AboutSection() {
  return (
    <section id="about" style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.25rem' }}>
      <div className="reveal" style={{ marginBottom: '2rem' }}>
        <p className="label">About</p>
      </div>

      <div className="reveal about-grid">
        <div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(1.6rem, 5vw, 2.6rem)', fontWeight: 700, lineHeight: 1.15 }}>
            The person<br /><em>behind the pixels</em>
          </h2>
        </div>
        <div>
          <p className="body-muted" style={{ fontSize: 'clamp(0.88rem, 3vw, 0.95rem)' }}>
            I bridge the gap between bold visuals and functional grit. From high-impact graphic design to precision-engineered CAD assemblies, I focus on creating work where every detail is intentional and every component has a purpose.
          </p>
        </div>
      </div>
    </section>
  )
}
