import { useEffect, useRef, useState } from 'react'

function WhyUs() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const reasons = [
    {
      icon: "⚡",
      title: "Kiire teenindus",
      desc: "Enamik remonte valmis sama päeva jooksul või 24h jooksul.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: "🛡️",
      title: "Garantii",
      desc: "Kõigile remontidele ja varuosadele vähemalt 6 kuu garantii.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: "👨‍🔧",
      title: "Kogemus",
      desc: "Üle 10 aasta kogemust arvutite ja mobiilide remondis.",
      color: "from-blue-400 to-indigo-500"
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
    <section id="why-us" ref={sectionRef} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white" style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}>
          Miks valida meid?
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className={`relative group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-700`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Taustavalgus hoveril */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              {/* Kaardi sisu - stabiilne */}
              <div className="card-inner relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:border-blue-500/50 transition-all duration-300" style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${reason.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{reason.title}</h3>
                <p className="text-blue-200">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs