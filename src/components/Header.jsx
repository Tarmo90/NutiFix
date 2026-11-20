import { useState, useEffect } from 'react'

const NAV = [
  { label: 'Teenused', href: '#services' },
  { label: 'Hinnakiri', href: '#pricing' },
  { label: 'Pakkumine', href: '#quote' },
  { label: 'Staatus', href: '#status' },
  { label: 'Miks Nutifix?', href: '#why-us' },
  { label: 'KKK', href: '#faq' },
  { label: 'Kontakt', href: '#contact' },
]

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = NAV.map((item) => document.querySelector(item.href)).filter(Boolean)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(100, (window.scrollY / height) * 100) : 0)
      const marker = window.scrollY + window.innerHeight * 0.35
      let current = ''
      sections.forEach((section) => {
        if (section.offsetTop <= marker) current = `#${section.id}`
      })
      setActive(current)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-slate-900/80 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex justify-between items-center">

        {/* VASAKUL — logo */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0"
        >
          <img
            src="/logo.png"
            alt="NutiFix"
            className="h-7 sm:h-8 md:h-9 w-auto max-w-[50vw] object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </button>

        {/* PAREMAL — navigatsioon */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative text-sm font-medium transition-colors duration-300 py-1 ${
                active === item.href ? 'text-white' : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                active === item.href ? 'w-full' : 'w-0'
              }`}></span>
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white text-xl hover:scale-110 transition-transform bg-transparent border-none p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile nav */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-[420px]' : 'max-h-0'}`}>
        <nav className="bg-slate-900/95 backdrop-blur-md px-4 pb-3 pt-1 space-y-1">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 transition-all duration-300 text-sm"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}

export default Header