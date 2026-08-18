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

// Iga kaardi jaoks eraldi komponent
function InfoCard({ icon, title, color, shortText, details, isOpen, onToggle, direction = 'left', delay = 0 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Turvavõrk: garanteerib, et kaart muutub nähtavaks ka siis, kui
    // IntersectionObserver mingil põhjusel kunagi ei käivitu.
    const fallback = setTimeout(() => setIsVisible(true), 700)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          clearTimeout(fallback)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )

    observer.observe(el)

    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  const initialX = direction === 'left' ? -120 : direction === 'right' ? 120 : 0
  const initialY = direction === 'up' ? 60 : direction === 'down' ? -60 : 0

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={`
        relative rounded-xl border cursor-pointer
        hover:border-blue-500/50
        transition-all duration-500 ease-out
        ${isOpen ? 'ring-2 ring-blue-500/50 border-blue-500/50' : 'border-white/20'}
      `}
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: isOpen ? '0 20px 60px rgba(59, 130, 246, 0.3)' : 'none',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : `translate(${initialX}px, ${initialY}px)`,
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'transform, opacity'
      }}
    >
      <div className="p-4 sm:p-5 md:p-6">
        <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">{icon}</div>
        <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-2 leading-tight" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{title}</h3>
        <p className="text-white/90 text-sm sm:text-base mb-3 leading-snug">{shortText}</p>

        {/* Expanded content */}
        <div 
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: isOpen ? '300px' : '0px',
            opacity: isOpen ? 1 : 0,
            marginTop: isOpen ? '12px' : '0px',
            paddingTop: isOpen ? '12px' : '0px',
            borderTop: isOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
          }}
        >
          <div className="space-y-2 text-left">
            {details.map((detail, i) => (
              <div key={i} className="flex items-start gap-2 text-white/90 text-sm sm:text-base leading-snug">
                <span className="shrink-0">✓</span>
                <span>{detail.replace(/^✓\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 text-xs sm:text-sm text-white/60">
          {isOpen ? '↩ Kliki sulgemiseks' : '↗ Kliki lisainfo'}
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [particles, setParticles] = useState([])
  const [openCardIndex, setOpenCardIndex] = useState(-1)

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
        "Tasuta esmane diagnoos 15 minutiga",
        "Detailne hinnapakkumine enne remonti",
        "Kiiret remonti vajavad seadmed prioriteetseks"
      ]
    },
    {
      icon: "🛡️",
      title: "Garantii tööle",
      color: "from-purple-500 to-pink-500",
      shortText: "Kuni 12 kuud garantiid",
      details: [
        "6-12 kuud garantiid kõigile remontidele",
        "Originaal- ja kvaliteetsed varuosad",
        "Garantiiremont kiirelt ja tasuta",
        "Rahulolu garantii — ei meeldi, raha tagasi"
      ]
    },
    {
      icon: "🔧",
      title: "Usaldusväärne remont",
      color: "from-emerald-500 to-teal-500",
      shortText: "Korralikult tehtud",
      details: [
        "Hoolikas töö ja aus hind",
        "Populaarsed telefonid ja arvutid",
        "Kõik mis oskuste piires",
        "Läbipaistev tööprotsess ja aus suhtlus",
      ]
    }
  ]

  const handleToggle = (index) => {
    console.log('Clicked card:', index, 'Current open:', openCardIndex)
    setOpenCardIndex(prev => {
      const newIndex = prev === index ? -1 : index
      console.log('Setting openCardIndex to:', newIndex)
      return newIndex
    })
  }

  return (
    <section className="relative min-h-[auto] md:min-h-screen flex items-start justify-center overflow-hidden pt-28 sm:pt-[39rem] md:pt-[10rem] pb-32 md:pb-40">

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

      {/* BACKGROUND LOGO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="logo-pulse absolute inset-0"
          style={{
            backgroundImage: 'url(/logo.png)',
            backgroundSize: 'min(720px, 40%) auto',
            backgroundPosition: 'center 98%',
            backgroundRepeat: 'no-repeat',
            opacity: 0.2,
            willChange: 'transform, opacity, filter'
          }}
        />
        {/* DIAGNOSTIKA-SKANN — hele joon "skaneerib" logo kuju seest läbi,
            kasutades logo enda siluetti maskina, nii et valgus paistab
            AINULT logo joonistuse peal, mitte kogu kastis. Sobib "Kiire
            diagnostika" sõnumiga. */}
        <div
          className="logo-scan absolute inset-0"
          style={{
            WebkitMaskImage: 'url(/logo.png)',
            maskImage: 'url(/logo.png)',
            WebkitMaskSize: 'min(720px, 40%) auto',
            maskSize: 'min(720px, 40%) auto',
            WebkitMaskPosition: 'center 98%',
            maskPosition: 'center 98%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            backgroundImage: 'linear-gradient(180deg, transparent 0%, transparent 42%, rgba(147,197,253,0.95) 50%, transparent 58%, transparent 100%)',
            backgroundSize: '100% 260%',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'screen',
            willChange: 'background-position, opacity'
          }}
        />
      </div>

      {/* CONTENT */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>

        <div className="text-center">

          <SlideIn direction="up" delay={0}>
            <h1
              className="relative text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 max-w-5xl mx-auto leading-tight tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent"
            >
              REMONT JA HOOLDUS ARVUTITELE NING MOBIILIDELE
            </h1>
          </SlideIn>

          <SlideIn direction="up" delay={0.15}>
            <p
              className="relative text-base sm:text-xl md:text-2xl mb-6 sm:mb-8 text-white max-w-2xl mx-auto leading-relaxed px-2"
            >
              Kiire, professionaalne ja usaldusväärne teenus
            </p>
          </SlideIn>

          {/* BUTTONS */}
          <div className="relative mt-2 sm:mt-3 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center max-w-xl mx-auto" style={{ zIndex: 1 }}>
            <SlideIn direction="left" delay={0.3} className="w-full md:w-auto">
              <a href="#contact" className="group relative px-5 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 hover:scale-10 overflow-hidden inline-block w-full md:w-auto">
                <span className="relative z-10">Broneeri aeg</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
              </a>
            </SlideIn>
            <SlideIn direction="right" delay={0.3} className="w-full md:w-auto">
              <a href="tel:+37258530404" className="px-5 sm:px-8 py-3.5 sm:py-4 border-2 border-white text-white rounded-xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 hover:bg-white hover:text-slate-900 hover:scale-10 relative overflow-hidden inline-block w-full md:w-auto">
                Helista: 5853 30404
              </a>
            </SlideIn>
          </div>

          {/* CARDS */}
           <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 md:gap-6 max-w-5xl mx-auto items-start">
            {cards.map((item, index) => (
              <InfoCard
                key={`card-${index}`}
                icon={item.icon}
                title={item.title}
                color={item.color}
                shortText={item.shortText}
                details={item.details}
                isOpen={openCardIndex === index}
                onToggle={() => handleToggle(index)}
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
        /* Logo ise jääb paigale (ei pulseeri enam) — ainult diagnostika-skann
           liigub selle sees, vt allpool .logo-scan. */
        @keyframes logoScan {
          0%, 8% { background-position: 0% -80%; opacity: 0; }
          20% { opacity: 1; }
          75% { opacity: 1; }
          92%, 100% { background-position: 0% 180%; opacity: 0; }
        }
        .logo-scan { animation: logoScan 3.5s ease-in-out infinite; }
      `}</style>

    </section>
  )
}

export default Hero