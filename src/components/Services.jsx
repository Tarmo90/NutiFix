import { useState, useRef, useEffect } from 'react'

function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.05, rootMargin: '-20px 0px -20px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getTransform = () => {
    if (isVisible) return 'translate(0, 0) scale(1)'

    switch (direction) {
      case 'left': return 'translateX(-200px) scale(0.85)'
      case 'right': return 'translateX(200px) scale(0.85)'
      case 'up': return 'translateY(100px) scale(0.9)'
      case 'down': return 'translateY(-100px) scale(0.9)'
      default: return 'translateX(-200px) scale(0.85)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? delay : 0}s`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  )
}

function Services() {
  const [flipped, setFlipped] = useState({})
  const [showButton, setShowButton] = useState({})
  const cardRefs = useRef([])

  const services = [
    {
      icon: "💻",
      title: "Arvutite remont",
      description: "Sülearvutite ja lauaarvutite riist- ja tarkvaraparandus, viiruste eemaldamine, süsteemi uuendamine.",
      price: "al 25€",
      color: "from-blue-500 to-cyan-500",
      details: [
        "✅ Sülearvuti emaplaadi remont",
        "✅ Protsessori ja GPU vahetus",
        "✅ Viiruste ja pahavara eemaldamine",
        "✅ Windows/macOS/Linux paigaldus"
      ]
    },
    {
      icon: "📱",
      title: "Mobiilide remont",
      description: "Ekraanivahetus, aku vahetus, laadimispesa parandus, veekahjustuste likvideerimine.",
      price: "al 35€",
      color: "from-purple-500 to-pink-500",
      details: [
        "✅ Ekraani ja puuteplaadi vahetus",
        "✅ Aku ja laadimispesa remont",
        "✅ Veekahjustuste kuivatus ja puhastus",
        "✅ iPhone, Samsung, Huawei, Xiaomi"
      ]
    },
    {
      icon: "🔋",
      title: "Aku vahetus",
      description: "Originaal- ja kvaliteetsed asendusakud sülearvutitele ja nutitelefonidele.",
      price: "al 20€",
      color: "from-green-500 to-emerald-500",
      details: [
        "✅ Originaalakud Apple ja Samsung",
        "✅ Kvaliteetsed analoogakud teistele",
        "✅ Aku tervise diagnostika",
        "✅ Garantii 12 kuud akule"
      ]
    },
    {
      icon: "💾",
      title: "Andmete taastamine",
      description: "Kustunud või rikutud kõvaketastelt andmete päästmine ja varundamine.",
      price: "al 50€",
      color: "from-orange-500 to-red-500",
      details: [
        "✅ Kustunud failide taastamine",
        "✅ Vigaste kõvaketaste lugemine",
        "✅ SSD ja M.2 ketaste päästmine",
        "✅ Konfidentsiaalsus garanteeritud"
      ]
    },
    {
      icon: "🖥️",
      title: "Ekraanide vahetus",
      description: "LCD, OLED ja puutetundlike ekraanide professionaalne vahetus.",
      price: "al 45€",
      color: "from-indigo-500 to-purple-500",
      details: [
        "✅ OLED ja AMOLED ekraanid",
        "✅ LCD ja IPS paneelid",
        "✅ Puutetundliku klaasi vahetus",
        "✅ Garantii 6 kuud ekraanile"
      ]
    },
    {
      icon: "🛡️",
      title: "Tarkvara paigaldus",
      description: "Windows, macOS, Linux paigaldus, draiverite uuendamine, programmide seadistamine.",
      price: "al 30€",
      color: "from-teal-500 to-blue-500",
      details: [
        "✅ Windows 10/11 paigaldus ja aktiveerimine",
        "✅ macOS uuendamine ja puhastamine",
        "✅ Linux distributsioonide seadistamine",
        "✅ Office, Adobe ja muu tarkvara"
      ]
    }
  ]

  const toggleFlip = (index) => {
    const newFlipped = !flipped[index]
    setFlipped(prev => ({ ...prev, [index]: newFlipped }))
    
    if (!newFlipped) {
      setShowButton(prev => ({ ...prev, [index]: false }))
    }
  }

  useEffect(() => {
    services.forEach((_, index) => {
      if (flipped[index] && !showButton[index]) {
        const timer = setTimeout(() => {
          setShowButton(prev => ({ ...prev, [index]: true }))
        }, 600)
        
        return () => clearTimeout(timer)
      }
    })
  }, [flipped])

  // UUS: IntersectionObserver iga kaardi jaoks - pöörab tagasi kui kaob ekraanilt
  useEffect(() => {
    const observers = []

    cardRefs.current.forEach((ref, index) => {
      if (!ref) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Kui kaart läheb ekraanilt välja JA on ümberpööratud, siis pöörab tagasi
          if (!entry.isIntersecting && flipped[index]) {
            setFlipped(prev => ({ ...prev, [index]: false }))
            setShowButton(prev => ({ ...prev, [index]: false }))
          }
        },
        { threshold: 0.1, rootMargin: '0px' }
      )

      observer.observe(ref)
      observers.push(observer)
    })

    return () => {
      observers.forEach(obs => obs.disconnect())
    }
  }, [flipped]) // sõltub flipped state-st, et teaks millised on ümberpööratud

  const getDirection = (index) => {
    const row = Math.floor(index / 3)
    if (row === 0) return 'left'
    return 'right'
  }

  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-4">
        <SlideIn direction="up" delay={0}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white text-glow">
            Teenused
          </h2>
        </SlideIn>

        <SlideIn direction="up" delay={0.1}>
          <p className="text-center text-blue-200 mb-16 text-xl">
            Professionaalne remont kõikidele populaarsetele seadmetele
          </p>
        </SlideIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <SlideIn
              key={index}
              direction={getDirection(index)}
              delay={0.1 + (index % 3) * 0.12}
            >
              <div 
                className="relative h-80"
                ref={el => cardRefs.current[index] = el}
              >
                
                <div
                  className="h-full perspective-1000 cursor-pointer"
                  onClick={() => toggleFlip(index)}
                >
                  <div 
                    className={`relative w-full h-full transition-all duration-700 ${flipped[index] ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className={`h-full bg-gradient-to-br ${service.color} rounded-2xl p-8 flex flex-col items-center justify-center text-white box-glow tilt`}>
                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                        <p className="text-white/80 text-center">{service.description}</p>
                        <div className="mt-4 text-3xl font-black">{service.price}</div>
                        <div className="mt-4 text-sm text-white/60">Kliki detailideks →</div>
                      </div>
                    </div>

                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="h-full bg-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-white border-2 border-blue-500/30">
                        <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                        <ul className="text-left space-y-2 text-blue-200">
                          {service.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-10 ${showButton[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                  style={{ zIndex: 100 }}
                >
                  <a 
                    href="#contact"
                    className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-white font-bold no-underline inline-block shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    Broneeri aeg
                  </a>
                </div>

              </div>
            </SlideIn>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services