import { useEffect, useRef, useState } from 'react'

function WhyUs() {
  const [isVisible, setIsVisible] = useState(true)
  const sectionRef = useRef(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // Turvavõrk: kui IntersectionObserver mingil põhjusel ei käivitu
    // (nt teatud ekraanipildistamise tööriistad), muutub sektsioon
    // igal juhul nähtavaks.
    const fallback = setTimeout(() => setIsVisible(true), 700)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          clearTimeout(fallback)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)

    return () => {
      clearTimeout(fallback)
      observer.disconnect()
    }
  }, [])

  const reasons = [
    {
      icon: "⚡",
      title: "Kiire teenindus",
      desc: "Enamik remonte valmis 3–5 tööpäeva jooksul; varuosa tellimisel täpsustame.",
      color: "from-purple-400 to-blue-700"
    },
    {
      icon: "🛡️",
      title: "Garantii",
      desc: "Kõigile remontidele ja varuosadele 3 kuu garantii.",
      color: "from-blue-500 to-purple-800"
    },
    {
      icon: "👨‍🔧",
      title: "Kogemus",
      desc: "Üle 10 aasta kogemust arvutite ja mobiilide remondis.",
      color: "from-red-600 to-orange-400"
    },
    {
      icon: "💎",
      title: "Hinnapoliitika",
      desc: "Läbipaistev hinnakiri – ei ole peidetud tasusid.",
      color: "from-purple-400 to-pink-500"
    }
  ]

  // Stabiilne hover handler ilma värinata
  const handleMouseMove = (e) => {
    const card = e.currentTarget.querySelector('.card-inner')
    if (!card) return
    
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Väiksem nurk = stabiilsem
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = (e) => {
    const card = e.currentTarget.querySelector('.card-inner')
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    }
  }

  return (
    <section id="why-us" ref={sectionRef} className="py-14 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-12 md:mb-16 text-white" >
          Miks valida NutiFix?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`relative group h-full flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Taustavalgus hoveril */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

              {/* Kaardi sisu - stabiilne, alati sama kõrgusega kui reas kõige kõrgem kaart */}
              <div className="card-inner relative flex-1 flex flex-col justify-center bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 text-center border border-white/10 hover:border-blue-500/50 transition-all duration-300" style={{ transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d', willChange: 'transform' }}>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br ${reason.color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {reason.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2 text-white shrink-0">{reason.title}</h3>
                <p className="text-blue-200 text-sm sm:text-sm leading-snug">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs