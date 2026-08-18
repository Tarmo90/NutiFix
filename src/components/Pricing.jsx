import { useRef, useState, useEffect } from 'react'

function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Turvavõrk: kui IntersectionObserver mingil põhjusel ei käivitu,
    // muutub sisu igal juhul nähtavaks.
    const fallback = setTimeout(() => setIsVisible(true), 700)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          clearTimeout(fallback)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.05, rootMargin: '-20px 0px -20px 0px' }
    )
    observer.observe(el)
    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
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

function AccordionItem({ title, icon, color, rows, isOpen, onToggle, itemRef }) {
  const contentRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen, rows])

  return (
    <div className="mb-3" ref={itemRef}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 rounded-xl bg-slate-800/80 border border-white/20 hover:border-blue-400/50 transition-all duration-300 ${isOpen ? 'border-blue-400/60 bg-slate-800' : ''}`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-base sm:text-xl shrink-0`}>
            {icon}
          </span>
          <span className="text-sm sm:text-lg md:text-xl font-bold text-white text-left">{title}</span>
        </div>
        <span
          className="text-blue-300 text-base sm:text-xl transition-transform duration-300 shrink-0 ml-2"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-out"
        style={{ height: `${height}px` }}
      >
        <div ref={contentRef} className="pt-2">
          <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-white/5 overflow-hidden">
            {rows.map((row, i) => (
              <div
                key={i}
                className={`flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 ${
                  i !== rows.length - 1 ? 'border-b border-white/5' : ''
                } hover:bg-white/5 transition-colors`}
              >
                <span className="text-white text-sm sm:text-base font-medium leading-tight">{row.service}</span>
                <span className="text-white font-bold text-sm sm:text-lg whitespace-nowrap mt-1 sm:mt-0">{row.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const categories = [
  {
    slug: "sulearvuti-ekraan",
    title: "Sülearvutite ekraani vahetus",
    icon: "💻",
    color: "from-blue-500 to-cyan-500",
    rows: [
      { service: `Standard 14-15.6 tolli ekraan`, price: "alates 95€" },
      { service: "IPS / kõrgkvaliteediline paneel", price: "alates 115€" },
      { service: "OLED / Retina (MacBook, Dell XPS)", price: "alates 180€" },
      { service: "Hinge remont koos ekraaniga", price: "+35€" },
    ]
  },
  {
    slug: "arvuti-hooldus",
    title: "Arvutite puhastus ja hooldus",
    icon: "🧹",
    color: "from-teal-500 to-green-500",
    rows: [
      { service: "Sülearvuti puhastus + termopasta vahetus", price: "35€" },
      { service: "Lauaarvuti puhastus + termopasta vahetus", price: "40€" },
      { service: "Mänguarvuti puhastus", price: "50€" },
      { service: "Jahutuse parandamine", price: "30€ + osa" },
      { service: "Termopasta vahetus eraldi", price: "20€" },
    ]
  },
  {
    slug: "kovaketas",
    title: "Kõvaketta vahetus",
    icon: "💾",
    color: "from-orange-500 to-amber-500",
    rows: [
      { service: "HDD → SSD uuendus (andmetega)", price: "40€ + SSD" },
      { service: "Kiire SSD paigaldus", price: "35€ + SSD" },
      { service: "Tavalise SSD paigaldus", price: "30€ + SSD" },
      { service: "Välise ketta korpusesse panemine", price: "20€ + korpus" },
      { service: "Ketta tervise kontroll", price: "Tasuta" },
    ]
  },
  {
    slug: "andmed",
    title: "Andmete varundus ja taastamine",
    icon: "🔐",
    color: "from-red-500 to-rose-500",
    rows: [
      { service: "Andmete ülekandmine välisele kettale", price: "30€" },
      { service: "Kustunud failide tagasi toomine (lihtne)", price: "50€" },
      { service: "Kustunud failide tagasi toomine (keeruline)", price: "90-180€" },
      { service: "Vigase ketta andmete päästmine", price: "150-350€" },
      { service: "SSD ketta andmete päästmine", price: "120-280€" },
      { service: "Telefoni andmete tagasi toomine", price: "70-200€" },
    ]
  },
  {
    slug: "optimeerimine",
    title: "Arvuti kiiremaks tegemine ja puhastamine",
    icon: "⚡",
    color: "from-yellow-500 to-orange-500",
    rows: [
      { service: "Kiire puhastus (1-2h)", price: "30€" },
      { service: "Põhjalik puhastus (3-4h)", price: "50€" },
      { service: "Viiruste ja pahavara eemaldamine", price: "35€" },
      { service: "Käivituse kiiremaks tegemine", price: "20€" },
      { service: "Juhtprogrammide uuendamine", price: "20€" },
      { service: "Täielik puhastus + kiiremaks tegemine", price: "65€" },
    ]
  },
  {
    slug: "it-kiirabi",
    title: "IT kiirabi",
    icon: "🚑",
    color: "from-rose-500 to-pink-600",
    rows: [
      { service: "Kaugabi (kaugühendus)", price: "25€ / tund" },
      { service: "Kohapealne abi (Võru)", price: "35€ / tund" },
      { service: "Kohapealne abi (lähiümbrus)", price: "35€ / tund + sõit" },
      { service: "Seadme toomine remonti", price: "15€ (Võru)" },
      { service: "Ööpäevaringne kiire abi", price: "50€ / tund" },
    ]
  },
  {
    slug: "ruuter",
    title: "Ruuterite ja koduvõrkude paigaldus",
    icon: "📡",
    color: "from-indigo-500 to-violet-500",
    rows: [
      { service: "Ruuteri seadistamine (1 seade)", price: "40€" },
      { service: "Tugevama võrgu paigaldus (2-3 seadet)", price: "80€" },
      { service: "Vana ruuteri vahetus uue vastu", price: "35€" },
      { service: "Võrgu turvalisuse kontroll", price: "35€" },
      { service: "Nutiseadmete ühendamine", price: "20€ / seade" },
    ]
  },
  {
    slug: "parool",
    title: "Parooli lähtestamine & IT tugi",
    icon: "🔑",
    color: "from-slate-500 to-gray-500",
    rows: [
      { service: "Windowsi parooli taastamine", price: "25€" },
      { service: "Androidi lukustuse eemaldamine (lihtne)", price: "30€" },
      { service: "Androidi lukustuse eemaldamine (keeruline)", price: "50€" },
      { service: "Nõustamine (30 min)", price: "15€" },
      { service: "Nõustamine (1 tund)", price: "25€" },
    ]
  },
  {
    slug: "os-paigaldus",
    title: "Windowsi/Linuxi paigaldus ja seadistamine",
    icon: "💿",
    color: "from-cyan-500 to-blue-600",
    rows: [
      { service: "Windows 10/11 paigaldus (puhas)", price: "50€" },
      { service: "Windows + juhtprogrammid + uuendused", price: "65€" },
      { service: "Windows + programmid (Office jne)", price: "80€" },
      { service: "Linux (Ubuntu / Mint) paigaldus", price: "40€" },
      { service: "Kahe süsteemiga arvuti (Windows + Linux)", price: "70€" },
      { service: "macOS paigaldus (Macile)", price: "55€" },
    ]
  },
  {
    slug: "printer",
    title: "Printerite ja lisaseadmete seadistamine",
    icon: "🖨️",
    color: "from-lime-500 to-green-600",
    rows: [
      { service: "Printeri ühendamine (juhtmega)", price: "30€" },
      { service: "Printeri ühendamine (WiFi)", price: "35€" },
      { service: "Võrguprinteri seadistamine", price: "40€" },
      { service: "Skanneri ühendamine", price: "20€" },
      { service: "Veebikaamera ühendamine", price: "15€" },
      { service: "Täitepaagiga tindisüsteemi paigaldus", price: "35€" },
      { service: "Lisaseadmete komplekt (3 seadet)", price: "70€" },
    ]
  },
]

function Pricing() {
  const [openIndex, setOpenIndex] = useState(-1)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const itemRefs = useRef([])

  const packages = [
    {
      name: "Arvuti Põhipakett",
      emoji: "🥉",
      price: "35€",
      color: "from-amber-600 to-orange-700",
      features: ["Tuvastamine", "Puhastus", "Termopasta vahetus"],
    },
    {
      name: "Arvuti Hoolduspakett",
      emoji: "🥈",
      price: "60€",
      color: "from-blue-600 to-indigo-600",
      features: ["Põhipakett", "SSD kontroll", "Kiiremaks tegemine"],
    },
    {
      name: "Arvuti Täispakett",
      emoji: "🥇",
      price: "90€",
      color: "from-purple-600 to-pink-600",
      features: ["Hoolduspakett", "Süsteemi kiiremaks tegemine", "Andmete varundus"],
    },
  ]

  // Check hash and open matching accordion
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#pricing-')) {
        const slug = hash.replace('#pricing-', '')
        const index = categories.findIndex(cat => cat.slug === slug)
        if (index !== -1) {
          setOpenIndex(index)
          // Oota kuni accordion avaneb, siis keri täpselt kategooria juurde
          setTimeout(() => {
            const el = itemRefs.current[index]
            if (el) {
              const rect = el.getBoundingClientRect()
              const scrollTop = window.pageYOffset + rect.top - 120
              window.scrollTo({ top: scrollTop, behavior: 'smooth' })
            }
          }, 550)
        }
      } else if (hash === '#pricing') {
        const pricingSection = document.getElementById('pricing')
        if (pricingSection) {
          pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    // Check on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }

  return (
    <section id="pricing" className="py-14 sm:py-16 md:py-20 relative">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <SlideIn direction="up" delay={0}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 text-white">
            Hinnakiri
          </h2>
          <p className="text-center text-white mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
            Kõik hinnad sisaldavad tööjõudu. Varuosad hinna sees või eraldi.
          </p>
          <p className="text-center text-white/70 mb-6 sm:mb-8 text-xs sm:text-sm md:text-base">
            *Tasuta diagnostika. Täpne hind selgub pärast seadme ülevaatust. Kõikidele remontidele vähemalt 6 kuu garantii.*
          </p>
        </SlideIn>

        {/* Mobiiliteenuste info */}
        <SlideIn direction="up" delay={0.05}>
          <div className="mb-8 sm:mb-10 p-4 sm:p-5 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/20">
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl">📱</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Mobiiliteenused</h3>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                  Telefonide ekraani- ja akuvahetuste hinnad sõltuvad seadme mudelist ning kasutatavatest varuosadest
                  (LCD, OLED või originaal). Võta ühendust <strong>tasuta diagnostikaks</strong> – saad personaalse pakkumise
                  koos täpse hinnaga enne töö algust!
                </p>
                <a
                  href="#contact"
                  className="inline-block mt-3 text-sm sm:text-base text-white hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Küsi mobiiliremondi pakkumist →
                </a>
              </div>
            </div>
          </div>
        </SlideIn>

        {/* Paketid */}
        <SlideIn direction="up" delay={0.1}>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <span>🛠️</span> Arvuti hoolduspaketid
          </h3>
          <div className="nf-pkg-grid">
            {packages.map((pkg, i) => {
              const isSelected = selectedPackage === i
              return (
                <div
                  key={i}
                  onClick={() => setSelectedPackage(isSelected ? null : i)}
                  className={`nf-pkg-card relative bg-gradient-to-br ${pkg.color} border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 ${
                    isSelected ? 'border-white shadow-lg shadow-white/20 scale-105' : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-3 -right-3 bg-white text-slate-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg">
                      ✓
                    </div>
                  )}
                  <div className="nf-pkg-emoji">{pkg.emoji}</div>
                  <h4 className="nf-pkg-name">{pkg.name}</h4>
                  <div className="nf-pkg-price">{pkg.price}</div>
                  <ul className="nf-pkg-features">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="nf-pkg-feature">
                        <span className="shrink-0">✅</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={`nf-pkg-btn font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900'
                      : i === 0
                        ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                        : i === 1
                          ? 'bg-blue-400/30 text-white hover:bg-blue-400/40 border border-blue-300/40'
                          : 'bg-purple-400/30 text-white hover:bg-purple-400/40 border border-purple-300/40'
                  }`}>
                    {isSelected ? '✓ Valitud' : 'Kliki valimiseks'}
                  </div>
                </div>
              )
            })}
          </div>

          {selectedPackage !== null && (
            <div className="text-center mb-12 p-4 sm:p-6 bg-blue-600/20 rounded-xl border border-blue-400/30">
              <p className="text-white text-sm sm:text-lg mb-3">
                Valisid: <span className="font-bold text-blue-300">{packages[selectedPackage].name}</span> ({packages[selectedPackage].price})
              </p>
              <a
                href="#contact"
                className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-sm sm:text-lg transition-colors"
                onClick={() => {
                  // Navigate to contact
                }}
              >
                Broneeri see pakett →
              </a>
            </div>
          )}
        </SlideIn>

        {/* Accordion */}
        <SlideIn direction="up" delay={0.15}>
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Detailne hinnakiri
              <span className="text-xs sm:text-sm font-normal text-blue-300/60 ml-2">(kliki lahti)</span>
            </h3>
          </div>
        </SlideIn>

        {categories.map((cat, i) => (
          <AccordionItem
            key={i}
            {...cat}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            itemRef={el => itemRefs.current[i] = el}
          />
        ))}

        {/* Footer */}
        <SlideIn direction="up" delay={0.1}>
          <div className="text-center mt-12 p-4 sm:p-6 bg-slate-800/40 rounded-xl border border-white/10">
            <p className="text-white/90 mb-4 text-sm sm:text-lg">
              Kas sa ei leia oma teenust või seadet? Võta meiega ühendust – teeme sulle personaalse pakkumise!
            </p>
            <a
              href="#contact"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-base sm:text-xl transition-colors"
            >
              Küsi pakkumist
            </a>

          </div>
        </SlideIn>
      </div>

      {/* Hoolduspaketi-kaartide paigutus on siin otse tavalise CSS-ina
          (samal proovitud-toimival põhjusel nagu Teenused-sektsioonis) –
          telefonis oli sisu (emoji/pealkiri/hind/nimekiri/nupp) liiga
          suurte vahedega laiali, sest kasutati fikseeritud lauaarvuti-
          suuruseid ja fikseeritud min-height'i, mis polnud telefonis vajalik. */}
      <style>{`
        .nf-pkg-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 32px;
        }
        .nf-pkg-card {
          border-radius: 16px;
          padding: 16px;
          text-align: center;
        }
        .nf-pkg-emoji { font-size: 2rem; margin-bottom: 4px; }
        .nf-pkg-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .nf-pkg-price { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 8px; }
        .nf-pkg-features {
          text-align: left;
          color: rgba(255,255,255,0.9);
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nf-pkg-feature { display: flex; align-items: flex-start; gap: 6px; }
        .nf-pkg-btn {
          margin-top: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
        }

        @media (min-width: 640px) {
          .nf-pkg-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 48px; }
          .nf-pkg-card { padding: 24px; }
          .nf-pkg-emoji { font-size: 3rem; margin-bottom: 8px; }
          .nf-pkg-name { font-size: 1.125rem; margin-bottom: 8px; }
          .nf-pkg-price { font-size: 2.25rem; margin-bottom: 16px; }
          .nf-pkg-features { font-size: 0.875rem; gap: 8px; min-height: 90px; }
          .nf-pkg-btn { margin-top: 16px; padding: 8px 16px; font-size: 0.875rem; }
        }
        @media (min-width: 768px) {
          .nf-pkg-name { font-size: 1.25rem; }
          .nf-pkg-price { font-size: 2.5rem; }
        }
        @media (min-width: 1024px) {
          .nf-pkg-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  )
}

export default Pricing