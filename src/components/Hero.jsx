import { useEffect, useState, useRef } from 'react'

// Scroll-triggered animation wrapper
function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
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

// Iga kaardi jaoks eraldi komponent
function InfoCard({ icon, title, color, shortText, details, direction = 'left', delay = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const initialX = direction === 'left' ? -120 : direction === 'right' ? 120 : 0
  const initialY = direction === 'up' ? 60 : direction === 'down' ? -60 : 0

  return (
    <div
      ref={ref}
      onClick={() => setIsOpen(!isOpen)}
      className={`
        relative rounded-xl border cursor-pointer
        hover:border-blue-500/50
        transition-all duration-500 ease-out
        ${isOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : 'border-white/20'}
      `}
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: isOpen ? '0 20px 60px rgba(59, 130, 246, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.4)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : `translate(${initialX}px, ${initialY}px)`,
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'transform, opacity'
      }}
    >
      <div className="p-6">
        <div className="text-5xl mb-3">{icon}</div>
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-blue-200/80 text-sm mb-3">{shortText}</p>

        {/* Expanded content */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-64 opacity-100 mt-3 pt-3 border-t border-white/10' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-2 text-left">
            {details.map((detail, i) => (
              <p key={i} className="text-white/80 text-sm">{detail}</p>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs text-white/40">
          {isOpen ? '↩ Kliki sulgemiseks' : '↗ Kliki lisainfo'}
        </div>
      </div>
    </div>
  )
}

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

  const cards = [
    {
      icon: "⚡",
      title: "Kiire diagnostika",
      color: "from-blue-500 to-cyan-500",
      shortText: "Professionaalne diagnostika",
      details: [
        "✓ Tasuta esmane diagnoos 15 minutiga",
        "✓ Täpne rikke tuvastus professionaalse seadmetega",
        "✓ Detailne hinnapakkumine enne remonti",
        "✓ Kiiret remonti vajavad seadmed prioriteetseks"
      ]
    },
    {
      icon: "🛡️",
      title: "Garantii tööle",
      color: "from-purple-500 to-pink-500",
      shortText: "Kuni 12 kuud garantiid",
      details: [
        "✓ 6-12 kuud garantiid kõigile remontidele",
        "✓ Originaal- ja kvaliteetsed varuosad",
        "✓ Garantiiremont kiirelt ja tasuta",
        "✓ Rahulolu garantii — ei meeldi, raha tagasi"
      ]
    },
    {
      icon: "🔧",
      title: "Professionaalne remont",
      color: "from-emerald-500 to-teal-500",
      shortText: "Kogenud tehnikud",
      details: [
        "✓ Üle 10 aasta kogemust",
        "✓ Spetsialiseerumine Apple, Samsung, Huawei",
        "✓ Ka keerulised emaplaadi remondid",
        "✓ Puhas ja turvaline töökoda"
      ]
    }
  ]

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 md:pt-40">

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

      {/* BACKGROUND LOGO - PARANDATUD */}
<div className="absolute inset-0 pointer-events-none flex items-end justify-center" style={{ zIndex: 0 }}>
  <div
    className="logo-pulse"
    style={{
      position: 'absolute',
      bottom: '-55%',        // ← MUUDA SIIN (was 0)
      left: '50%',
      width: '150vw',        // ← MUUDA SIIN (was 80vw)
      height: '120vh',       // ← MUUDA SIIN (was 40vh)
      maxWidth: 'none',      // ← EEMALDA maxWidth: 800px
      backgroundImage: 'url(/logo.png)',
      backgroundSize: 'contain',
      backgroundPosition: 'center bottom',
      backgroundRepeat: 'no-repeat',
      transform: 'translateX(-50%)',
      transformOrigin: 'center bottom',
      opacity: 0.2,          // ← MUUDA SIIN (was 0.3)
      willChange: 'transform, opacity, filter'
    }}
  />
</div>

      {/* CONTENT */}
      <div className="container mx-auto px-4 relative" style={{ zIndex: 10 }}>

        <div className="text-center">

          <SlideIn direction="up" delay={0}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white relative">
              ARVUTITE, MOBIILIDE REMONT JA HOOLDUS
            </h1>
          </SlideIn>

          <SlideIn direction="up" delay={0.15}>
            <p className="text-xl md:text-2xl mb-8 text-blue-200" >
              Kiire, professionaalne ja usaldusväärne teenus
            </p>
          </SlideIn>

          {/* BUTTONS */}
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <SlideIn direction="left" delay={0.3} className="w-full md:w-auto">
              <a href="#contact" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg transition-all duration-300 hover:scale-110 overflow-hidden inline-block w-full md:w-auto" style={{ boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)' }}>
                <span className="relative z-10">Broneeri aeg</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </a>
            </SlideIn>
            <SlideIn direction="right" delay={0.3} className="w-full md:w-auto">
              <a href="tel:+37258530404" className="px-8 py-4 border-2 border-blue-400 text-blue-400 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-blue-400 hover:text-white hover:scale-110 relative overflow-hidden inline-block w-full md:w-auto" style={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}>
                Helista: 5853 30404
              </a>
            </SlideIn>
          </div>

          {/* CARDS — igaüks oma state-ga */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

            {cards.map((item, index) => (
              <InfoCard
                key={index}
                icon={item.icon}
                title={item.title}
                color={item.color}
                shortText={item.shortText}
                details={item.details}
                direction={index === 0 ? 'left' : index === 2 ? 'right' : 'up'}
                delay={0.2 + index * 0.15}
              />
            ))}

          </div>

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
        @keyframes logoPulse {
          0%, 100% { opacity: 0.2; transform: translateX(-50%) scale(1); filter: blur(0.5px) brightness(1.0); }
          50% { opacity: 0.5; transform: translateX(-50%) scale(1.03); filter: blur(0.5px) brightness(1.4); }
        }
        .logo-pulse { animation: logoPulse 3s ease-in-out infinite; }
      `}</style>

    </section>
  )
}

export default Hero