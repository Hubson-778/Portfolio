import { useState } from 'react'
import WaveCanvas from './components/WaveCanvas'
import Nav from './components/Nav'
import HeroSection from './components/HeroSection'
import WorksSection from './components/WorksSection'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import YakuzaIntro from './components/YakuzaIntro'
import { useTheme } from './hooks/useTheme'
import { useScrollReveal } from './hooks/useScrollReveal'
import { useImagePreloader } from './hooks/useImagePreloader'
import { works } from './data/works'

const ALL_FULL_RES = works.flatMap(w => [
  w.src,
  ...(w.variants ?? []),
  ...(w.drawings ?? []),
])

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [showIntro, setShowIntro] = useState(false)
  useScrollReveal()
  useImagePreloader(ALL_FULL_RES)

  const triggerIntro = () => {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/intro.mp3`)
    audio.volume = 0.8
    audio.play().catch(() => {})
    setShowIntro(true)
  }

  return (
    <>
      {showIntro && <YakuzaIntro onDone={() => setShowIntro(false)} />}
      <WaveCanvas />
      <Nav theme={theme} onToggleTheme={toggleTheme} onNameClick={triggerIntro} />
      <HeroSection />
      <WorksSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </>
  )
}
