import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import DiagTerminal from './components/DiagTerminal'
import Pricing from './components/Pricing'
import WhyUs from './components/WhyUs'
import Contact from './components/Contact'
import Reviews from './components/Reviews'
import SmartQuote from './components/SmartQuote'
import Tracker from './components/Tracker'
import Faq from './components/Faq'
import Admin from './components/Admin'
import Footer from './components/Footer'
import Legal from './components/Legal'
import CookieConsent from './components/CookieConsent'


function App() {
  const [legal, setLegal] = useState(null)
  const openLegal = (type) => setLegal(type)
  const closeLegal = () => setLegal(null)

  return (
    <div className="min-h-screen text-white relative">

      {/* Layer 1 - noise texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          opacity: 0.4,
          zIndex: -10
        }}
      />

      {/* Layer 2 - background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: -20,
          background: 'linear-gradient(#0f172a 100%, #1e293b 100%, #0f172a 100%)'
        }}
      />

      {/* CONTENT */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Header />
        <Hero />
        <DiagTerminal />
        <SmartQuote />
        <Pricing />
        <WhyUs />
        <Reviews />
        <Faq />
        <Tracker />
        <Contact />
        <Admin />
        <Footer onOpenLegal={openLegal} />
      </div>

      <CookieConsent onOpenPrivacy={() => openLegal('privacy')} />
      <Legal type={legal} onClose={closeLegal} />
    </div>
  )
}

export default App
