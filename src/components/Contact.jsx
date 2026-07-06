import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: '',
    problem: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', phone: '', device: '', problem: '' })
    
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white text-glow">
          Broneeri aeg
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            {[
              { icon: "📍", title: "Aadress", text: "Tehnika tn 1, Tallinn" },
              { icon: "📞", title: "Telefon", text: "5123 4567", link: "tel:+37251234567" },
              { icon: "✉️", title: "E-post", text: "info@nutifix.ee", link: "mailto:info@nutifix.ee" }
            ].map((item, index) => (
              <div 
                key={index}
                className="group flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 tilt"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <div className="text-blue-300 text-sm">{item.title}</div>
                  {item.link ? (
                    <a href={item.link} className="text-white text-lg font-semibold hover:text-blue-400 transition-colors">
                      {item.text}
                    </a>
                  ) : (
                    <div className="text-white text-lg font-semibold">{item.text}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Lahtiolekuajad</h3>
              <div className="space-y-2 text-blue-200">
                <div className="flex justify-between">
                  <span>Esmaspäev – Reede</span>
                  <span className="text-white">9:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Laupäev</span>
                  <span className="text-white">10:00 – 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Pühapäev</span>
                  <span className="text-red-400">Suletud</span>
                </div>
              </div>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 box-glow"
          >
            {submitted && (
              <div className="absolute inset-0 bg-green-500/90 rounded-2xl flex items-center justify-center z-10 animate-pulse">
                <div className="text-white text-2xl font-bold text-center">
                  ✅<br/>Aitäh!<br/>Võtame ühendust
                </div>
              </div>
            )}
            
            <h3 className="text-2xl font-bold mb-6 text-white">Broneeri remont</h3>
            
            <div className="space-y-5">
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-blue-300 group-focus-within:text-blue-400 transition-colors">Nimi</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Sinu nimi"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-blue-300 group-focus-within:text-blue-400 transition-colors">Telefon</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02]"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="5123 4567"
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-blue-300 group-focus-within:text-blue-400 transition-colors">Seade</label>
                <input
                  type="text"
                  placeholder="nt iPhone 13, Dell Inspiron..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02]"
                  value={formData.device}
                  onChange={(e) => setFormData({...formData, device: e.target.value})}
                />
              </div>
              
              <div className="group">
                <label className="block text-sm font-medium mb-2 text-blue-300 group-focus-within:text-blue-400 transition-colors">Probleemi kirjeldus</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all duration-300 focus:scale-[1.02] resize-none"
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  placeholder="Kirjelda probleemi..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white box-glow'}`}
              >
                {isSubmitting ? 'Saadan...' : 'Broneeri aeg'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact