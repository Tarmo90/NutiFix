import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import Pricing from './components/Pricing'
import WhyUs from './components/WhyUs'
import Contact from './components/Contact'
import Footer from './components/Footer'


function App() {

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