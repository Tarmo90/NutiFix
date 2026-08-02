import { useRef, useState, useEffect } from 'react'

function SlideIn({ children, direction = 'left', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05, rootMargin: '-20px 0px -20px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
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
        className={`w-full flex items-center justify-between px-6 py-5 rounded-xl bg-slate-800/80 border border-white/20 hover:border-blue-400/50 transition-all duration-300 ${isOpen ? 'border-blue-400/60 bg-slate-800' : ''}`}
      >
        <div className="flex items-center gap-3">
          <span className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-xl`}>
            {icon}
          </span>
          <span className="text-xl font-bold text-white">{title}</span>
        </div>
        <span
          className="text-blue-300 text-xl transition-transform duration-300"
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
                className={`flex justify-between items-center px-6 py-3.5 ${
                  i !== rows.length - 1 ? 'border-b border-white/5' : ''
                } hover:bg-white/5 transition-colors`}
              >
                <span className="text-white text-base font-medium">{row.service}</span>
                <span className="text-white font-bold text-lg whitespace-nowrap ml-4">{row.price}</span>
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
      title: "Arvutite hooldus",
      icon: "🧹",
      color: "from-teal-500 to-green-500",
      rows: [
        { service: "Sülearvuti puhastus + termopasta", price: "35€" },
        { service: "Lauaarvuti puhastus + termopasta", price: "40€" },
        { service: "Gaming arvuti puhastus", price: "50€" },
        { service: "Jahutuse optimeerimine", price: "30€ + osa" },
        { service: "Termopasta vahetus eraldi", price: "20€" },
      ]
    },
    {
      slug: "kovaketas",
      title: "Kõvaketta / andmekandja vahetus",
      icon: "💾",
      color: "from-orange-500 to-amber-500",
      rows: [
        { service: "HDD → SSD upgrade (andmetega)", price: "40€ + SSD" },
        { service: "M.2 NVMe SSD paigaldus", price: "35€ + SSD" },
        { service: "SATA SSD paigaldus", price: "30€ + SSD" },
        { service: "Välise kõvaketta korpusse panemine", price: "20€ + korpus" },
        { service: "Ketta tervise diagnostika", price: "Tasuta" },
      ]
    },
    {
      slug: "andmed",
      title: "Andmete varundus & taastamine",
      icon: "🔐",
      color: "from-red-500 to-rose-500",
      rows: [
        { service: "Andmete varundus välisele kettale", price: "30€" },
        { service: "Kustunud failide taastamine (lihtne)", price: "50€" },
        { service: "Kustunud failide taastamine (keeruline)", price: "90-180€" },
        { service: "Vigase kõvaketta päästmine", price: "150-350€" },
        { service: "SSD / M.2 ketta päästmine", price: "120-280€" },
        { service: "Telefoni andmete taastamine", price: "70-200€" },
      ]
    },
    {
      slug: "optimeerimine",
      title: "Arvuti optimeerimine ja kiirendamine",
      icon: "⚡",
      color: "from-yellow-500 to-orange-500",
      rows: [
        { service: "Kiire optimeerimine (1-2h)", price: "30€" },
        { service: "Põhjalik optimeerimine (3-4h)", price: "50€" },
        { service: "Pahavara / viiruste eemaldamine", price: "35€" },
        { service: "Startup optimeerimine", price: "20€" },
        { service: "Draiverite uuendamine", price: "20€" },
        { service: "Täielik puhastus + optimeerimine", price: "65€" },
      ]
    },
    {
      slug: "it-kiirabi",
      title: "IT kiirabi",
      icon: "🚑",
      color: "from-rose-500 to-pink-600",
      rows: [
        { service: "Kaugabi (TeamViewer / AnyDesk)", price: "25€ / tund" },
        { service: "Kohapealne abi (Võru/Võrumaa)", price: "35€ / tund" },
        { service: "Kohapealne abi (lähiümbrus)", price: "35€ / tund + sõit" },
        { service: "Arvuti kättetoimetamine remonti", price: "15€ (Võru/Võrumaa)" },
        { service: "Ööpäevaringne erakorraline abi", price: "50€ / tund" },
      ]
    },
    {
      slug: "ruuter",
      title: "Ruuterite ja koduvõrkude paigaldus",
      icon: "📡",
      color: "from-indigo-500 to-violet-500",
      rows: [
        { service: "Ruuteri seadistamine (1 seade)", price: "40€" },
        { service: "Ruuteri seadistamine + WiFi optimeerimine", price: "55€" },
        { service: "Mesh-võrgu paigaldus (2-3 seadet)", price: "80€" },
        { service: "Vana ruuteri asendamine uuega", price: "35€" },
        { service: "Võrgu turvalisuse audit", price: "35€" },
        { service: "IoT seadmete ühendamine", price: "20€ / seade" },
      ]
    },
    {
      slug: "parool",
      title: "Parooli lähtestamine & IT tugi",
      icon: "🔑",
      color: "from-slate-500 to-gray-500",
      rows: [
        { service: "Windows parooli lähtestamine", price: "25€" },
        { service: "Android lukustuse eemaldamine (lihtne)", price: "30€" },
        { service: "Android lukustuse eemaldamine (keeruline)", price: "50€" },
        { service: "iPhone lukustuse eemaldamine", price: "35€" },
        { service: "Juhendamine (30 min)", price: "15€" },
        { service: "Juhendamine (1 tund)", price: "25€" },
      ]
    },
    {
      slug: "os-paigaldus",
      title: "OS paigaldus & draiverite seadistamine",
      icon: "💿",
      color: "from-cyan-500 to-blue-600",
      rows: [
        { service: "Windows 10/11 paigaldus (puhas)", price: "50€" },
        { service: "Windows + draiverid + uuendused", price: "65€" },
        { service: "Windows + programmid (Office jne)", price: "80€" },
        { service: "Linux (Ubuntu / Mint) paigaldus", price: "40€" },
        { service: "Dual-boot (Windows + Linux)", price: "70€" },
        { service: "macOS paigaldus (Macile)", price: "55€" },
      ]
    },
    {
      slug: "printer",
      title: "Printerite ja perifeeria seadistamine",
      icon: "🖨️",
      color: "from-lime-500 to-green-600",
      rows: [
        { service: "Printeri seadistamine (juhtmega)", price: "30€" },
        { service: "Printeri seadistamine (WiFi)", price: "35€" },
        { service: "Võrguprinteri konfigureerimine", price: "40€" },
        { service: "Skanneri seadistamine", price: "20€" },
        { service: "Veebikaamera seadistamine", price: "15€" },
        { service: "Tindisüsteemi paigaldus (CISS)", price: "35€" },
        { service: "Perifeeria komplekt (3 seadet)", price: "70€" },
      ]
    },
  ]

function Pricing() {
  const [openIndex, setOpenIndex] = useState(-1)
  const itemRefs = useRef([])

  const packages = [
    {
      name: "Arvuti Põhipakett",
      emoji: "🥉",
      price: "35€",
      color: "from-slate-600 to-gray-600",
      features: ["Diagnostika", "Puhastus", "Termopasta vahetus"],
    },
    {
      name: "Arvuti Hoolduspakett",
      emoji: "🥈",
      price: "60€",
      color: "from-blue-600 to-indigo-600",
      features: ["Põhipakett", "SSD kontroll", "Optimeerimine"],
    },
    {
      name: "Arvuti Täispakett",
      emoji: "🥇",
      price: "90€",
      color: "from-purple-600 to-pink-600",
      features: ["Hoolduspakett", "OS optimeerimine", "Varundus"],
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
    <section id="pricing" className="py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <SlideIn direction="up" delay={0}>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-3 text-white">
            Hinnakiri
          </h2>
          <p className="text-center text-white mb-4 text-lg">
            Kõik hinnad sisaldavad tööjõudu. Varuosad hinna sees või eraldi.
          </p>
          <p className="text-center text-white/70 mb-8 text-base">
            *Tasuta diagnostika. Täpne hind selgub pärast seadme ülevaatust. Kõikidele remontidele vähemalt 6 kuu garantii.*
          </p>
        </SlideIn>

        {/* Mobiiliteenuste info */}
        <SlideIn direction="up" delay={0.05}>
          <div className="mb-10 p-5 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-xl border border-purple-500/20">
            <div className="flex items-start gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Mobiiliteenused</h3>
                <p className="text-white/90 text-base leading-relaxed">
                  Telefonide ekraani- ja akuvahetuste hinnad sõltuvad seadme mudelist ning kasutatavatest varuosadest 
                  (LCD, OLED või originaal). Võta ühendust <strong>tasuta diagnostikaks</strong> – saad personaalse pakkumise 
                  koos täpse hinnaga enne töö algust!
                </p>
                <a 
                  href="#contact" 
                  className="inline-block mt-3 text-base text-white hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Küsi mobiiliremondi pakkumist →
                </a>
              </div>
            </div>
          </div>
        </SlideIn>

        {/* Paketid */}
        <SlideIn direction="up" delay={0.1}>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>🛠️</span> Arvuti hoolduspaketid
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-6 bg-gradient-to-br ${pkg.color} border border-white/10 text-center`}
              >
                <div className="text-4xl mb-2">{pkg.emoji}</div>
                <h4 className="text-xl font-bold text-white mb-2">{pkg.name}</h4>
                <div className="text-5xl font-black text-white mb-4">{pkg.price}</div>
                <ul className="text-left space-y-2 text-white/90 text-sm">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="text-base">✅ {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SlideIn>

        {/* Accordion */}
        <SlideIn direction="up" delay={0.15}>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span> Detailne hinnakiri
              <span className="text-sm font-normal text-blue-300/60 ml-2">(kliki lahti)</span>
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
          <div className="text-center mt-12 p-6 bg-slate-800/40 rounded-xl border border-white/10">
            <p className="text-white/90 mb-4 text-lg">
              Kas sa ei leia oma teenust või seadet? Võta meiega ühendust – teeme sulle personaalse pakkumise!
            </p>
            <a
              href="#contact"
              className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-xl transition-colors"
            >
              Küsi pakkumist
            </a>
            <p className="text-white/50 text-sm mt-4">
              Hindadele lisandub käibemaks 22%. NutiFix jätab endale õiguse hindu ette teatamata muuta.
            </p>
          </div>
        </SlideIn>
      </div>
    </section>
  )
}

export default Pricing