export default function Footer() {
  return (
    <footer style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem', position: 'relative' }}>
      <div className="divider" style={{ position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem' }} />
      <p className="footer-text">© {new Date().getFullYear()} Hubert Ambroszkiewicz</p>
    </footer>
  )
}
