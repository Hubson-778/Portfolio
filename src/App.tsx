import WaveCanvas from './components/WaveCanvas'
import Nav from './components/Nav'
import HeroSection from './components/HeroSection'
import WorksSection from './components/WorksSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import { useTheme } from './hooks/useTheme'
import { useScrollReveal } from './hooks/useScrollReveal'
import { useImagePreloader } from './hooks/useImagePreloader'
import { works } from './data/works'

// Collect every full-res URL across all works (src + variants + drawings)
const ALL_FULL_RES = works.flatMap(w => [
  w.src,
  ...(w.variants ?? []),
  ...(w.drawings ?? []),
])

export default function App() {
  const [theme, toggleTheme] = useTheme()
  useScrollReveal()
  useImagePreloader(ALL_FULL_RES)

  return (
    <>
      <WaveCanvas />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <HeroSection />
      <WorksSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  )
}
