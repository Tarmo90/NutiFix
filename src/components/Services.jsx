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

    // Väiksemad väärtused mobiilile – väldib horisontaalset scrolli
    switch (direction) {
      case 'left': return 'translateX(-60px) scale(0.95)'
      case 'right': return 'translateX(60px) scale(0.95)'
      case 'up': return 'translateY(40px) scale(0.97)'
      case 'down': return 'translateY(-40px) scale(0.97)'
      default: return 'translateX(-60px) scale(0.95)'
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
    gradient: "linear-gradient(to bottom right, #7c3aed, #0f172a)",
    pricingSlug: null,
    details: [
      "Samsung, iPhone, Xiaomi, Huawei",
      "OLED, AMOLED ja LCD paneelid",
      "Originaal- ja kvaliteetsed analoogid",
      "Garantii 6 kuud ekraanile"
    ]
  },
  {
    icon: "💻",
    title: "Sülearvutite ekraani vahetus",
    description: "Sülearvuti ekraani vahetus kiirelt ja professionaalselt.",
    gradient: "linear-gradient(to bottom right, #2563eb, #0f172a)",
    pricingSlug: "sulearvuti-ekraan",
    details: [
      "Dell, HP, Lenovo, Apple MacBook",
      "IPS, TN ja OLED paneelid",
      "Hinge remont koos ekraaniga",
      "Garantii 6 kuud"
    ]
  },
  {
    icon: "🔋",
    title: "Mobiiltelefonide aku vahetus",
    description: "Aku vahetus originaal- ja kvaliteetsete analoogakkudega.",
    gradient: "linear-gradient(to bottom right, #059669, #0f172a)",
    pricingSlug: null,
    details: [
      "Originaalakud Apple ja Samsung",
      "Kvaliteetsed analoogakud teistele",
      "Aku tervise diagnostika",
      "Garantii 12 kuud akule"
    ]
  },
  {
    icon: "🧹",
    title: "Arvutite hooldus",
    description: "Põhjalik puhastus ja jahutuse optimeerimine.",
    gradient: "linear-gradient(to bottom right, #0891b2, #0f172a)",
    pricingSlug: "arvuti-hooldus",
    details: [
      "Tolmupuhastus ja termopasta vahetus",
      "Jahutuse optimeerimine",
      "Ventilaatori mürataseme vähendamine",
      "Temperatuuride kontroll"
    ]
  },
  {
    icon: "💾",
    title: "Kõvaketta / andmekandja vahetus",
    description: "Ketta vahetus ja upgrade — kiirem ja mahukam salvestus.",
    gradient: "linear-gradient(to bottom right, #d97706, #0f172a)",
    pricingSlug: "kovaketas",
    details: [
      "HDD → SSD upgrade",
      "Andmete migreerimine vana kettalt",
      "M.2 NVMe ja SATA SSD paigaldus",
      "Ketta tervise diagnostika"
    ]
  },
  {
    icon: "🔐",
    title: "Andmete varundus & taastamine",
    description: "Kustunud või rikutud andmete päästmine ja varundamine.",
    gradient: "linear-gradient(to bottom right, #e11d48, #0f172a)",
    pricingSlug: "andmed",
    details: [
      "Kustunud failide taastamine",
      "Vigaste kõvaketaste lugemine",
      "SSD ja M.2 ketaste päästmine",
      "Konfidentsiaalsus garanteeritud"
    ]
  },
  {
    icon: "⚡",
    title: "Arvuti optimeerimine ja kiirendamine",
    description: "Sülearvuti või lauaarvuti kiirendamine ja puhastamine.",
    gradient: "linear-gradient(to bottom right, #ca8a04, #0f172a)",
    pricingSlug: "optimeerimine",
    details: [
      "Startup optimeerimine",
      "Pahavara ja viiruste eemaldamine",
      "Draiverite uuendamine",
      "Süsteemi puhastus ja defragmentatsioon"
    ]
  },
  {
    icon: "🚑",
    title: "IT kiirabi",
    description: "Kiire abi arvuti- ja IT-probleemidele.",
    gradient: "linear-gradient(to bottom right, #dc2626, #0f172a)",
    pricingSlug: "it-kiirabi",
    details: [
      "Kaugabi TeamViewer/AnyDeskiga",
      "Kohapealne abi",
      "Kiire reageerimine",
      "Nõustamine ja juhendamine"
    ]
  },
  {
    icon: "📡",
    title: "Ruuterite ja koduvõrkude paigaldus",
    description: "WiFi ja koduvõrgu seadistamine ning optimeerimine.",
    gradient: "linear-gradient(to bottom right, #4f46e5, #0f172a)",
    pricingSlug: "ruuter",
    details: [
      "Ruuteri seadistamine ja turvalisus",
      "WiFi katvuse optimeerimine",
      "Mesh-võrgu paigaldus",
      "IoT seadmete ühendamine"
    ]
  },
  {
    icon: "🔑",
    title: "Parooli lähtestamine & IT tugi",
    description: "Unustatud paroolide taastamine ja kasutajatugi.",
    gradient: "linear-gradient(to bottom right, #475569, #0f172a)",
    pricingSlug: "parool",
    details: [
      "Windows parooli lähtestamine",
      "Android lukustuse eemaldamine",
      "Andmete säilitamine kui võimalik",
      "Samm-sammuline juhendamine"
    ]
  },
  {
    icon: "💿",
    title: "OS paigaldus & draiverite seadistamine",
    description: "Operatsioonisüsteemide paigaldus ja draiverite uuendamine.",
    gradient: "linear-gradient(to bottom right, #0284c7, #0f172a)",
    pricingSlug: "os-paigaldus",
    details: [
      "Windows 10/11 paigaldus",
      "Linux distributsioonid",
      "Kõikide draiverite uuendamine",
      "Programmide paigaldus ja seadistamine"
    ]
  },
  {
    icon: "🖨️",
    title: "Printerite ja perifeeria seadistamine",
    description: "Printerite, skannerite ja muude seadmete ühendamine.",
    gradient: "linear-gradient(to bottom right, #16a34a, #0f172a)",
    pricingSlug: "printer",
    details: [
      "Printerite WiFi ja juhtmega ühendus",
      "Skannerite ja veebikaamerate seadistamine",
      "Võrguprinterite konfigureerimine",
      "Tindisüsteemide paigaldus"
    ]
  }
]

function Services() {
  const [flipped, setFlipped] = useState({})
  const cardRefs = useRef([])

  const toggleFlip = (index) => {
    setFlipped(prev => {
      const isOpen = !!prev[index]
      const newState = {}
      for (let i = 0; i < services.length; i++) {
        newState[i] = (i === index) ? !isOpen : false
      }
      return newState
    })
  }

  useEffect(() => {
    const observers = []

    cardRefs.current.forEach((ref, index) => {
      if (!ref) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && flipped[index]) {
            setFlipped(prev => ({ ...prev, [index]: false }))
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

  const scrollToPricing = (slug) => {
    if (slug) {
      window.location.hash = `pricing-${slug}`
    } else {
      window.location.hash = 'pricing'
    }
  }

  return (
    <section id="services" className="py-10 md:py-16 relative">
      <div className="container mx-auto px-4">
        <SlideIn direction="up" delay={0}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-2 md:mb-3 text-white">
            Teenused
          </h2>
        </SlideIn>

        <SlideIn direction="up" delay={0.1}>
          <p className="text-center text-blue-200 mb-6 md:mb-10 text-base md:text-lg">
            Professionaalne remont ja IT-abi kõikidele seadmetele
          </p>
        </SlideIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <SlideIn
              key={index}
              direction={getDirection(index)}
              delay={0.1 + (index % 4) * 0.08}
            >
              <div 
                className="relative h-64 md:h-80"
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
                    {/* ESIKÜLG */}
                    <div 
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <div 
                        className="h-full rounded-xl p-1 pb-12 md:pb-16 flex flex-col items-center text-white box-glow tilt relative" 
                        style={{ background: service.gradient }}
                      >
                        {/* Ikoon – väiksem mobiilis */}
                        <div className="text-3xl md:text-5xl mb-2 md:mb-3 mt-6 md:mt-11 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                          {service.icon}
                        </div>
                        
                        {/* Pealkiri – väiksem mobiilis */}
                        <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2 text-center leading-tight drop-shadow-md px-2">
                          {service.title}
                        </h3>
                        
                        {/* Kirjeldus – väiksem mobiilis */}
                        <p className="text-white text-center text-sm md:text-base leading-snug drop-shadow-sm px-3">
                          {service.description}
                        </p>

                        {/* Nupud all – kompaktsem mobiilis */}
                        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 md:gap-2 w-full px-3 md:px-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              scrollToPricing(service.pricingSlug)
                            }}
                            className="px-4 md:px-5 py-1.5 md:py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg text-white font-bold text-xs md:text-sm transition-all duration-300 border-2 border-white/40 hover:border-white/80 hover:shadow-lg hover:shadow-white/20 hover:scale-105 cursor-pointer"
                          >
                            Vaata hinda →
                          </button>
                          <span className="text-xs md:text-sm text-white font-semibold bg-black/30 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-white/30 drop-shadow-sm">
                            👆 Kliki detailideks
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* TAGAKÜLG */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                      }}
                    >
                      <div className="h-full bg-slate-800 rounded-xl p-3 md:p-5 pb-10 md:pb-14 flex flex-col items-center justify-center text-white border-2 border-blue-500/30 relative">
                        <h3 className="text-base md:text-xl font-bold mb-3 md:mb-5 text-center leading-tight">
                          {service.title}
                        </h3>
                        <ul className="w-full space-y-1 md:space-y-1.5 text-blue-200 text-sm md:text-base leading-snug">
                          {service.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="shrink-0">✅</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                        <a 
                          href="#contact"
                          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 px-4 md:px-5 py-1.5 md:py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors text-white font-bold no-underline inline-block shadow-lg text-xs md:text-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          Broneeri aeg
                        </a>
                      </div>
                    </div>
                  </div>
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