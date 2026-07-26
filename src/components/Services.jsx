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

  const services = [
    {
      icon: "📱",
      title: "Mobiiltelefonide ekraani vahetus",
      description: "Professionaalne ekraanivahetus kõikidele populaarsetele mudelitele.",
      color: "from-purple-500 to-pink-500",
      details: [
        "✅ Samsung, iPhone, Xiaomi, Huawei",
        "✅ OLED, AMOLED ja LCD paneelid",
        "✅ Originaal- ja kvaliteetsed analoogid",
        "✅ Garantii 6 kuud ekraanile"
      ]
    },
    {
      icon: "💻",
      title: "Sülearvutite ekraani vahetus",
      description: "Sülearvuti ekraani vahetus kiirelt ja professionaalselt.",
      color: "from-blue-500 to-cyan-500",
      details: [
        "✅ Dell, HP, Lenovo, Apple MacBook",
        "✅ IPS, TN ja OLED paneelid",
        "✅ Hinge remont koos ekraaniga",
        "✅ Garantii 6 kuud"
      ]
    },
    {
      icon: "🔋",
      title: "Mobiiltelefonide aku vahetus",
      description: "Aku vahetus originaal- ja kvaliteetsete analoogakkudega.",
      color: "from-green-500 to-emerald-500",
      details: [
        "✅ Originaalakud Apple ja Samsung",
        "✅ Kvaliteetsed analoogakud teistele",
        "✅ Aku tervise diagnostika",
        "✅ Garantii 12 kuud akule"
      ]
    },
    {
      icon: "🧹",
      title: "Arvutite hooldus",
      description: "Põhjalik puhastus ja jahutuse optimeerimine.",
      color: "from-teal-500 to-green-500",
      details: [
        "✅ Tolmupuhastus ja termopasta vahetus",
        "✅ Jahutuse optimeerimine",
        "✅ Ventilaatori mürataseme vähendamine",
        "✅ Temperatuuride kontroll"
      ]
    },
    {
      icon: "💾",
      title: "Kõvaketta / andmekandja vahetus",
      description: "Ketta vahetus ja upgrade — kiirem ja mahukam salvestus.",
      color: "from-orange-500 to-amber-500",
      details: [
        "✅ HDD → SSD upgrade",
        "✅ Andmete migreerimine vana kettalt",
        "✅ M.2 NVMe ja SATA SSD paigaldus",
        "✅ Ketta tervise diagnostika"
      ]
    },
    {
      icon: "🔐",
      title: "Andmete varundus & taastamine",
      description: "Kustunud või rikutud andmete päästmine ja varundamine.",
      color: "from-red-500 to-rose-500",
      details: [
        "✅ Kustunud failide taastamine",
        "✅ Vigaste kõvaketaste lugemine",
        "✅ SSD ja M.2 ketaste päästmine",
        "✅ Konfidentsiaalsus garanteeritud"
      ]
    },
    {
      icon: "⚡",
      title: "Arvuti optimeerimine ja kiirendamine",
      description: "Sülearvuti või lauaarvuti kiirendamine ja puhastamine.",
      color: "from-yellow-500 to-orange-500",
      details: [
        "✅ Startup optimeerimine",
        "✅ Pahavara ja viiruste eemaldamine",
        "✅ Draiverite uuendamine",
        "✅ Süsteemi puhastus ja defragmentatsioon"
      ]
    },
    {
      icon: "🚑",
      title: "IT kiirabi",
      description: "Kiire abi arvuti- ja IT-probleemidele.",
      color: "from-rose-500 to-pink-600",
      details: [
        "✅ Kaugabi TeamViewer/AnyDeskiga",
        "✅ Kohapealne abi",
        "✅ Kiire reageerimine",
        "✅ Nõustamine ja juhendamine"
      ]
    },
    {
      icon: "📡",
      title: "Ruuterite ja koduvõrkude paigaldus",
      description: "WiFi ja koduvõrgu seadistamine ning optimeerimine.",
      color: "from-indigo-500 to-violet-500",
      details: [
        "✅ Ruuteri seadistamine ja turvalisus",
        "✅ WiFi katvuse optimeerimine",
        "✅ Mesh-võrgu paigaldus",
        "✅ IoT seadmete ühendamine"
      ]
    },
    {
      icon: "🔑",
      title: "Parooli lähtestamine & IT tugi",
      description: "Unustatud paroolide taastamine ja kasutajatugi.",
      color: "from-slate-500 to-gray-500",
      details: [
        "✅ Windows parooli lähtestamine",
        "✅ Android lukustuse eemaldamine",
        "✅ Andmete säilitamine kui võimalik",
        "✅ Samm-sammuline juhendamine"
      ]
    },
    {
      icon: "💿",
      title: "OS paigaldus & draiverite seadistamine",
      description: "Operatsioonisüsteemide paigaldus ja draiverite uuendamine.",
      color: "from-cyan-500 to-blue-600",
      details: [
        "✅ Windows 10/11 paigaldus",
        "✅ Linux distributsioonid",
        "✅ Kõikide draiverite uuendamine",
        "✅ Programmide paigaldus ja seadistamine"
      ]
    },
    {
      icon: "🖨️",
      title: "Printerite ja perifeeria seadistamine",
      description: "Printerite, skannerite ja muude seadmete ühendamine.",
      color: "from-lime-500 to-green-600",
      details: [
        "✅ Printerite WiFi ja juhtmega ühendus",
        "✅ Skannerite ja veebikaamerate seadistamine",
        "✅ Võrguprinterite konfigureerimine",
        "✅ Tindisüsteemide paigaldus"
      ]
    }
  ]

function Services() {
  const [flipped, setFlipped] = useState({})
  const [showButton, setShowButton] = useState({})
  const cardRefs = useRef([])


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
  }, [flipped, showButton])

  useEffect(() => {
    const observers = []

    cardRefs.current.forEach((ref, index) => {
      if (!ref) return

      const observer = new IntersectionObserver(
        ([entry]) => {
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
  }, [flipped])

  const getDirection = (index) => {
    const row = Math.floor(index / 4)
    if (row === 0) return 'left'
    return 'right'
  }

  return (
    <section id="services" className="py-16 relative">
      <div className="container mx-auto px-4">
        <SlideIn direction="up" delay={0}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-3 text-white text-glow">
            Teenused
          </h2>
        </SlideIn>

        <SlideIn direction="up" delay={0.1}>
          <p className="text-center text-blue-200 mb-10 text-lg">
            Professionaalne remont ja IT-abi kõikidele seadmetele
          </p>
        </SlideIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <SlideIn
              key={index}
              direction={getDirection(index)}
              delay={0.1 + (index % 4) * 0.08}
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
                    {/* ESIKÜLG - ilma hinnata */}
                    <div 
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div className={`h-full bg-gradient-to-br ${service.color} rounded-xl p-6 flex flex-col items-center justify-center text-white box-glow tilt`}>
                        <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                        <h3 className="text-lg font-bold mb-2 text-center leading-tight">{service.title}</h3>
                        <p className="text-white/80 text-center text-base leading-snug">{service.description}</p>

                        {/* HINNA LINGI ASENDUS */}
                        <div className="mt-5 flex flex-col items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              const el = document.getElementById('pricing')
                              if (el) {
                                const headerOffset = 80
                                const elementPosition = el.getBoundingClientRect().top
                                const offsetPosition = elementPosition + window.pageYOffset - headerOffset
                                window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
                              }
                            }}
                            className="px-5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-bold text-sm transition-all duration-300 border border-white/20 hover:border-white/40 cursor-pointer"
                          >
                            Vaata hinda →
                          </button>
                          <span className="text-xs text-white/50">Kliki kaarti detailideks</span>
                        </div>
                      </div>
                    </div>

                    {/* TAGAKÜLG - detailid */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="h-full bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-white border-2 border-blue-500/30">
                        <h3 className="text-lg font-bold mb-4 text-center leading-tight">{service.title}</h3>
                        <ul className="text-left space-y-2 text-blue-200 text-base leading-snug">
                          {service.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Broneeri nupp tagaküljel */}
                <div 
                  className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${showButton[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                  style={{ zIndex: 100 }}
                >
                  <a 
                    href="#contact"
                    className="px-6 py-2.5 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-white font-bold no-underline inline-block shadow-lg text-base"
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