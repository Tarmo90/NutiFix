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
    pricingSlug: null,
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
    pricingSlug: "sulearvuti-ekraan",
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
    color: "from-blue-600 to-indigo-700",
    pricingSlug: null,
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
    pricingSlug: "arvuti-hooldus",
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
    pricingSlug: "kovaketas",
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
    pricingSlug: "andmed",
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
    color: "from-slate-700 to-slate-900",
    pricingSlug: "optimeerimine",
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
    pricingSlug: "it-kiirabi",
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
    pricingSlug: "ruuter",
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
    pricingSlug: "parool",
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
    pricingSlug: "os-paigaldus",
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
    pricingSlug: "printer",
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
    // Ainult üks kaart korraga lahti – kui avad uue kaardi, pöördub
    // eelmine avatud kaart ise automaatselt tagasi.
    setFlipped(prev => {
      const isOpen = !!prev[index]
      const next = {}
      services.forEach((_, i) => {
        next[i] = (i === index) ? !isOpen : false
      })
      return next
    })
    // "Broneeri aeg" nupp peab iga avamise korral uuesti oma väikese
    // viivitusega ilmuma, ja kõigil teistel (nüüd suletud) kaartidel kaduma.
    setShowButton({})
  }

  const scrollToPricing = (slug) => {
    window.location.hash = slug ? `pricing-${slug}` : 'pricing'
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
    <section id="services" className="nf-services-section relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SlideIn direction="up" delay={0}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 sm:mb-3 text-white">
            Teenused
          </h2>
        </SlideIn>

        <SlideIn direction="up" delay={0.1}>
          <p className="text-center text-blue-200 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg">
            Professionaalne remont ja IT-abi kõikidele seadmetele
          </p>
        </SlideIn>

        <div className="nf-services-grid">
          {services.map((service, index) => (
            <SlideIn
              key={index}
              direction={getDirection(index)}
              delay={0.1 + (index % 4) * 0.08}
            >
              <div
                className="relative nf-service-card"
                ref={el => cardRefs.current[index] = el}
              >

                <div
                  className="h-full perspective-1000 cursor-pointer"
                  onClick={() => toggleFlip(index)}
                >
                  <div
                    className={`relative w-full h-full transition-all duration-700 ${flipped[index] ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' }}
                  >
                    {/* ESIKÜLG - ilma hinnata */}
                    <div
                      className="absolute inset-0"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div
                        className={`nf-front-content bg-gradient-to-br ${service.color} tilt`}
                      >
                        {/* Tumendav kate värvilise tausta peal – mõnel kaardil
                            (nt helesinine, laimikollane, oranž) oli tekst
                            liiga heleda taustavärvi peal raskesti loetav.
                            See kate tagab kõigil kaartidel piisava kontrastsuse,
                            ükskõik mis värvi gradient all on. */}
                        <div className="nf-front-overlay"></div>
                        <div className="nf-front-inner">
                          <div className="nf-front-icon transform group-hover:scale-110 transition-transform duration-300">
                            {service.icon}
                          </div>
                          {/* Pealkirjal ja kirjeldusel on fikseeritud kõrgus (nf-front-title/
                              nf-front-desc), et 1- ja 2-realised pealkirjad/tekstid ei
                              nihutaks nuppu igal kaardil erinevale kõrgusele – nii jäävad
                              kõik tekstid ja nupud kõigil kaartidel samale reale. */}
                          <h3 className="nf-front-title">{service.title}</h3>
                          <p className="nf-front-desc">{service.description}</p>

                          {/* HINNA LINGI ASENDUS – marginTop:auto lükkab nupugrupi alati
                              kaardi põhja, sõltumata pealkirja/kirjelduse pikkusest. */}
                          <div className="nf-front-btns">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                scrollToPricing(service.pricingSlug)
                              }}
                              className="px-4 sm:px-5 py-1.5 sm:py-2 bg-black/55 hover:bg-black/75 backdrop-blur-md rounded-lg text-white font-bold text-xs sm:text-sm transition-all duration-300 border-2 border-white/70 hover:border-white cursor-pointer"
                              style={{ boxShadow: '0 0 14px rgba(255,255,255,0.4)' }}
                            >
                              Vaata hinda →
                            </button>
                            <span className="text-xs text-white/90 font-semibold">Kliki kaarti detailideks</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TAGAKÜLG - detailid */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        WebkitTransform: 'rotateY(180deg)'
                      }}
                    >
                      <div
                        className="h-full bg-slate-800 rounded-xl text-white border-2 border-blue-500/30 nf-back-content"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Paigutuse/vahede PÕHISTIILID on siin otse CSS-ina
                            (nf-back-* klassid allpool <style> sildis), sest
                            sinu eelvaade/build ei jõudnud uusi Tailwind
                            klasse usaldusväärselt kompileerida – tavaline
                            CSS töötab alati. Sama CSS teeb teksti telefonis
                            väiksemaks, et miski liiga suur ei tunduks. */}
                        <h3
                          className="nf-back-title font-bold text-center leading-tight"
                          style={{ flexShrink: 0 }}
                        >
                          {service.title}
                        </h3>
                        <ul
                          className="card-scroll nf-back-list text-blue-200 leading-snug"
                          style={{ width: '100%', maxHeight: '100%', overflowY: 'auto', textAlign: 'left' }}
                        >
                          {service.details.map((detail, i) => (
                            // Linnuke eraldi, kitsa fikseeritud laiusega – nii jääb
                            // murdunud tekst joonduma teksti (mitte linnukese) alla.
                            <li
                              key={i}
                              style={{ display: 'flex', alignItems: 'flex-start' }}
                            >
                              <span style={{ flexShrink: 0 }}>✅</span>
                              <span>{detail.replace(/^✅\s*/, '')}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Broneeri nupp tagaküljel – eredam ja helendav, telefonis veidi väiksem */}
                <div
                  className={`absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${showButton[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                  style={{ zIndex: 100 }}
                >
                  <a
                    href="#contact"
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-bold no-underline inline-block rounded-lg text-sm sm:text-base"
                    
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

      {/* Kõik selle sektsiooni PAIGUTUSE jaoks kriitilised mõõdud (kaardi
          kõrgus, ruudustiku veerud/vahed, sektsiooni padding, tagakülje
          teksti suurused) on siin otse tavalise CSS-ina, MITTE Tailwind
          klassidena. Põhjus: build jättis need Tailwind klassid vahel
          kompileerimata, mis lõhkus kogu kaartide paigutuse (kaardid
          kaotasid kõrguse ja kattusid). Tavaline CSS selles <style>
          sildis kehtib alati, ükskõik mida Tailwind teeb või ei tee. */}
      <style>{`
        .nf-services-section { padding-top: 20px; padding-bottom: 40px; }
        .nf-services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .nf-service-card { height: 256px; }

        /* Esikülg – pealkirjal/kirjeldusel fikseeritud kõrgus, et nupp
           jääks alati kaardi põhja, ükskõik mitu rida tekst võtab. */
        .nf-front-content {
          position: relative;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        /* Tumendav kate gradient-tausta peal, et tekst oleks alati loetav,
           ka kõige heledamate taustavärvidega kaartidel (nt oranž/laimikollane/helesinine). */
        .nf-front-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.38);
          pointer-events: none;
        }
        .nf-front-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          color: #fff;
          padding: 16px;
        }
        .nf-front-icon { font-size: 1.875rem; margin-bottom: 8px; }
        .nf-front-title {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.25;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.45);
        }
        .nf-front-desc {
          font-size: 0.75rem;
          line-height: 1.375;
          height: 2.0625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.92);
          text-shadow: 0 1px 2px rgba(0,0,0,0.4);
        }
        .nf-front-btns {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding-top: 16px;
        }

        .nf-back-content { padding: 16px 16px 52px 16px; }
        .nf-back-title { font-size: 1rem; margin-bottom: 10px; }
        .nf-back-list { font-size: 0.875rem; }
        .nf-back-list li { margin-bottom: 6px; gap: 6px; }

        @media (min-width: 640px) {
          .nf-services-section { padding-top: 28px; padding-bottom: 48px; }
          .nf-services-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .nf-service-card { height: 320px; }

          .nf-front-inner { padding: 20px; }
          .nf-front-icon { font-size: 2.25rem; margin-bottom: 16px; }
          .nf-front-title { font-size: 1.125rem; height: 2.8125rem; margin-bottom: 8px; }
          .nf-front-desc { font-size: 0.875rem; height: 2.40625rem; }
          .nf-front-btns { gap: 8px; padding-top: 24px; }

          .nf-back-content { padding: 24px 24px 64px 24px; }
          .nf-back-title { font-size: 1.125rem; margin-bottom: 16px; }
          .nf-back-list { font-size: 1rem; }
          .nf-back-list li { margin-bottom: 8px; gap: 8px; }
        }
        @media (min-width: 768px) {
          .nf-front-desc { font-size: 1rem; height: 2.75rem; }
        }
        @media (min-width: 1024px) {
          .nf-services-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1280px) {
          .nf-services-section { padding-top: 36px; padding-bottom: 64px; }
          .nf-services-grid { gap: 24px; }
        }
      `}</style>
    </section>
  )
}

export default Services
