import { useEffect, useState, useRef } from 'react'

// Scroll-triggered animation wrapper
function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Turvavõrk: kui IntersectionObserver mingil põhjusel (nt teatud
    // ekraanipildistamise/renderdustööriistad) ei käivitu, muutub sisu
    // igal juhul nähtavaks – see ei jää kunagi jäädavalt peidetuks.
    const fallback = setTimeout(() => setIsVisible(true), 700)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          clearTimeout(fallback)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)

    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  const getInitialTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-100px)'
      case 'right': return 'translateX(100px)'
      case 'up': return 'translateY(60px)'
      case 'down': return 'translateY(-60px)'
      default: return 'translateX(-100px)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  )
}

// Hero on meelega lühike: kolm infokaarti kordasid "Miks NutiFix?" sektsiooni,
// seega need eemaldati ja asemel on otsetee interaktiivse diagnostikani.
function Hero() {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  return (
    <section id="hero" className="nf-hero relative min-h-[auto] flex items-start justify-center overflow-hidden pt-32 md:pt-40 pb-12 md:pb-16">

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-blue-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `floatParticle ${10 / p.speed}s ease-in-out ${p.delay}s infinite`,
              boxShadow: `0 0 ${p.size * 2}px rgba(59, 130, 246, 0.5)`
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>

        <div className="text-center">

          {/* Pealkirja kohal seisev logo — skaneeriva valgusjoonega */}
          <SlideIn direction="up" delay={0}>
            <div className="nf-hero-mark">
              <img src="/logo.png" alt="NutiFix" />
              <span
                className="nf-hero-mark-scan"
                aria-hidden="true"
                style={{
                  WebkitMaskImage: 'url(/logo.png)',
                  maskImage: 'url(/logo.png)'
                }}
              />
            </div>
          </SlideIn>

          <SlideIn direction="up" delay={0}>
            <h1
              className="relative text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 max-w-5xl mx-auto leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent"
            >
              Arvutite ja mobiilide remont Võrus
            </h1>
          </SlideIn>

          <SlideIn direction="up" delay={0.15}>
            <p
              className="relative text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white max-w-2xl mx-auto leading-relaxed px-2"
            >
              Kiire ja usaldusväärne remont — tasuta diagnostika, hind enne tööd.
            </p>
          </SlideIn>

          {/* BUTTONS */}
          <div className="relative mt-2 sm:mt-3 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center max-w-xl mx-auto" style={{ zIndex: 1 }}>
            <SlideIn direction="left" delay={0.3} className="w-full md:w-auto">
              <a href="#contact" className="group relative px-5 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-105 overflow-hidden inline-block w-full md:w-auto">
                <span className="relative z-10">Broneeri aeg</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </a>
            </SlideIn>
            <SlideIn direction="right" delay={0.3} className="w-full md:w-auto">
              <a href="tel:+37258530404" className="px-5 sm:px-8 py-3.5 sm:py-4 border-2 border-white text-white rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 hover:bg-white hover:text-slate-900 hover:scale-105 relative overflow-hidden inline-block w-full md:w-auto">
                Helista: 5853 30404
              </a>
            </SlideIn>
          </div>

          <SlideIn direction="up" delay={0.45}>
            <a
              href="#diag"
              className="inline-flex items-center gap-2 mt-5 text-sm sm:text-base text-white/70 hover:text-cyan-300 transition-colors"
            >
              <span className="nf-live-dot" aria-hidden="true" />
              Vaata, kuidas diagnostika käib
              <span aria-hidden="true">↓</span>
            </a>
          </SlideIn>

        </div>
      </div>

      {/* CSS */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.3; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.6; }
        }
        /* Pealkirja-kohane logo: hele joon libiseb logo silueti sees */
        @keyframes heroLogoScan {
          0%, 6% { background-position: 0% -90%; opacity: 0; }
          18% { opacity: 1; }
          76% { opacity: 1; }
          94%, 100% { background-position: 0% 190%; opacity: 0; }
        }
        .nf-hero-mark {
          position: relative;
          width: min(400px, 76%);
          margin: 0 auto 32px;
          filter: drop-shadow(0 16px 44px rgba(56, 189, 248, 0.32));
        }
        .nf-hero-mark img { display: block; width: 100%; height: auto; }
        .nf-hero-mark-scan {
          position: absolute;
          inset: 0;
          pointer-events: none;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          background-image: linear-gradient(180deg, transparent 0%, transparent 44%, rgba(191, 232, 255, 0.95) 50%, transparent 56%, transparent 100%);
          background-size: 100% 260%;
          background-repeat: no-repeat;
          mix-blend-mode: screen;
          animation: heroLogoScan 3.6s ease-in-out infinite;
        }
        @media (max-width: 640px) {
          .nf-hero-mark { width: min(280px, 78%); margin-bottom: 22px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-hero-mark-scan { animation: none; opacity: 0; }
        }
      `}</style>

    </section>
  )
}

export default Hero
