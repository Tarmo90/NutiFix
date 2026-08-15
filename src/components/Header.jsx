import { useState, useEffect } from 'react'

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
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
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        
        {/* VASAKUL — logo */}
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 group cursor-pointer bg-transparent border-none p-0 pt-6"
        >
          <img 
            src="/logo.png" 
            alt="NutiFix" 
            className="h-48 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </button>

        {/* PAREMAL — navigatsioon */}
        <nav className="hidden md:flex items-center space-x-6">
          {['Teenused', 'Hinnakiri', 'Miks Nutifix?', 'Kontakt'].map((item, index) => (
            <a 
              key={index}
              href={`#${['services', 'pricing', 'why-us', 'contact'][index]}`}
              className="relative text-white/80 hover:text-white transition-colors duration-300 text-base font-medium group py-1"
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></span>
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
      <div className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
        <nav className="bg-slate-900/90 backdrop-blur-md px-4 pb-3 space-y-1">
          {['Teenused', 'Hinnakiri', 'Miks meie?', 'Kontakt'].map((item, index) => (
            <a 
              key={index}
              href={`#${['services', 'pricing', 'why-us', 'contact'][index]}`}
              className="block py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-3 transition-all duration-300 text-sm"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header