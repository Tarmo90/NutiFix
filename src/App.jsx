import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Pricing from './components/Pricing'
import WhyUs from './components/WhyUs'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useEffect, useState } from 'react'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen text-white relative">

      {/* Layer 1 - logo blur */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -30 }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/logo.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.05,
            filter: 'blur(80px)',
            transform: `scale(1.2) translateY(${scrollY * 0.05}px)`
          }}
        />
      </div>

      {/* Layer 2 - gradient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -20 }}>
        <div 
          className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-10"
          style={{ transform: `translateY(${scrollY * 0.02}px)` }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500 rounded-full blur-3xl opacity-10"
          style={{ transform: `translateY(${scrollY * -0.02}px)` }}
        ></div>
      </div>

      {/* Layer 3 - noise */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          opacity: 0.4,
          zIndex: -10
        }}
      />

      {/* Layer 4 - background */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: -40,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
        }}
      />

      {/* CONTENT */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Header />
        <Hero />
        <Services />
        <Pricing />
        <WhyUs />
        <Contact />
        <Footer />
      </div>

    </div>
  )
}

export default App