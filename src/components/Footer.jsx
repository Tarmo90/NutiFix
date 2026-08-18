function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/0 py-6">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
               NutiFix
            </span>
          </div>
          
          <div className="flex gap-6">
            <a 
              href="https://www.facebook.com/profile.php?id=61593277231244"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              Facebook
            </a>
            <a 
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-300 hover:scale-110 transform"
            >
              Instagram
            </a>
          </div>
          
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} NutiFix OÜ. Kõik õigused kaitstud.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer