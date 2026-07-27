import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    device: '',
    problem: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // ⬇⬇⬇ ASENDA SEE OMA FORM ID-ga pärast Formspree registreerimist!
  const FORMSPREE_ID = 'xgogrjql'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          service: formData.service,
          device: formData.device,
          message: formData.problem
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', phone: '', service: '', device: '', problem: '' })
        setTimeout(() => setSubmitted(false), 5000)
      } else {
        setError('Midagi läks valesti. Proovi uuesti või helista!')
      }
    } catch (err) {
      setError('Võrgu viga. Kontrolli ühendust või helista!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const services = [
    'Mobiiltelefonide ekraani vahetus',
    'Sülearvutite ekraani vahetus',
    'Mobiiltelefonide aku vahetus',
    'Arvutite hooldus',
    'Kõvaketta / andmekandja vahetus',
    'Andmete varundus & taastamine',
    'Arvuti optimeerimine ja kiirendamine',
    'IT kiirabi',
    'Ruuterite ja koduvõrkude paigaldus',
    'Parooli lähtestamine & IT tugi',
    'OS paigaldus & draiverite seadistamine',
    'Printerite ja perifeeria seadistamine',
    'Muu / Ei ole kindel'
  ]

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white text-glow">
          Broneeri aeg
        </h2>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

          {/* VASAKUL — Kontaktinfo */}
          <div className="space-y-8">
            {[
              { icon: "📍", title: "Asukoht", text: "Võru, Eesti" },
              { icon: "📞", title: "Telefon", text: "5XX XXXX", link: "tel:+3725XXXXXXXX" },
              { icon: "✉️", title: "E-post", text: "nutifix.info@gmail.com", link: "mailto:nutifix.info@gmail.com" }
            ].map((item, index) => (
              <a 
                key={index}
                href={item.link || '#'}
                className="group flex items-center gap-4 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div>
                  <div className="text-blue-300 text-sm">{item.title}</div>
                  <div className="text-white text-lg font-semibold group-hover:text-blue-400 transition-colors">
                    {item.text}
                  </div>
                </div>
              </a>
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

          {/* PAREMAL — Vorm */}
          <form 
            onSubmit={handleSubmit} 
            className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            {submitted && (
              <div className="absolute inset-0 bg-green-500/90 rounded-2xl flex items-center justify-center z-10">
                <div className="text-white text-2xl font-bold text-center px-4">
                  ✅<br/>Aitäh!<br/>Võtame<br/>ühendust
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <h3 className="text-2xl font-bold mb-6 text-white">Broneeri remont</h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-blue-300">Nimi *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Sinu nimi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-blue-300">Telefon *</label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="5123 4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-blue-300">Teenus *</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white transition-all"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                >
                  <option value="" disabled>Vali teenus...</option>
                  {services.map((s, i) => (
                    <option key={i} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-blue-300">Seade</label>
                <input
                  type="text"
                  placeholder="nt iPhone 13, Dell Inspiron..."
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all"
                  value={formData.device}
                  onChange={(e) => setFormData({...formData, device: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-blue-300">Probleemi kirjeldus</label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 transition-all resize-none"
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  placeholder="Kirjelda probleemi lühidalt..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30'}`}
              >
                {isSubmitting ? 'Saadan...' : 'Broneeri aeg'}
              </button>

              <p className="text-xs text-blue-300/60 text-center">
                Võtan ühendust 24h jooksul telefoni või emaili teel
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact