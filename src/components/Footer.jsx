function Footer({ onOpenLegal }) {
  return (
    <footer className="bg-slate-900 border-t border-white/10 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NutiFix
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a
              href="https://www.facebook.com/profile.php?id=61593277231244"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors duration-300"
            >
              Facebook
            </a>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="text-slate-400 hover:text-white transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer"
            >
              Privaatsuspoliitika
            </button>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="text-slate-400 hover:text-white transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer"
            >
              Kasutustingimused
            </button>
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
