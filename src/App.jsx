import HolographicBackground from './components/HolographicBackground'
import CustomCursor from './components/CustomCursor'
import FloatingActions from './components/FloatingActions'
import Navbar from './components/Navbar'
import About from './sections/About'
import Achievements from './sections/Achievements'
import Contact from './sections/Contact'
import Experience from './sections/Experience'
import Footer from './sections/Footer'
import Hero from './sections/Hero'
import Portfolio from './sections/Portfolio'
import Skills from './sections/Skills'
import SocialHandles from './sections/SocialHandles'

export default function App() {
  return (
    <>
      <HolographicBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Experience />
        <Achievements />
        <SocialHandles />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
      <CustomCursor />
    </>
  )
}
