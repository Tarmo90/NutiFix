import { useEffect, useState } from 'react'
import { createRepair } from '../repairs'

const SERVICES = [
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
  'Muu / Ei ole kindel',
]

function isOpenNow() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Tallinn',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date())
    const get = (type) => parts.find((p) => p.type === type)?.value || ''
    const day = get('weekday')
    const hour = Number(get('hour')) + Number(get('minute')) / 60
    if (day === 'Sun') return false
    if (day === 'Sat') return hour >= 10 && hour < 18
    return hour >= 9 && hour < 18
  } catch {
    return false
  }
}

function Contact() {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', service: '', device: '', problem: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [repairCode, setRepairCode] = useState('')
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(isOpenNow())

  useEffect(() => {
    const timer = setInterval(() => setOpen(isOpenNow()), 60000)
    const fill = (event) => {
      const detail = event.detail || {}
      setFormData((prev) => ({
        ...prev,
        service: detail.service || prev.service,
        device: detail.device || prev.device,
        problem: detail.message || prev.problem,
      }))
    }
    window.addEventListener('nf:quote', fill)
    return () => {
      clearInterval(timer)
      window.removeEventListener('nf:quote', fill)
    }
  }, [])

  const FORMSPREE_ID = 'xgogrjql'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const message = (formData.problem || '').trim()
    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          service: formData.service,
          device: formData.device,
          message,
        }),
      })
      if (response.ok) {
        // Formspree toob kirja kohale; Firestore'i dokument annab kliendile
        // jälgimiskoodi. Kui Firestore on kättesaamatu, päring ei kadu —
        // kuvame ikka kinnituse, aga ilma koodita.
        let code = ''
        try {
          const created = await createRepair({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service: formData.service,
            device: formData.device,
            message,
          })
          code = created.code
        } catch (err) {
          console.warn('Jälgimiskoodi loomine ebaõnnestus:', err)
        }
        setRepairCode(code)
        setSubmitted(true)
        setFormData({ name: '', phone: '', email: '', service: '', device: '', problem: '' })
        setTimeout(() => setSubmitted(false), 8000)
      } else {
        setError('Midagi läks valesti. Proovi uuesti või helista!')
      }
    } catch {
      setError('Võrgu viga. Kontrolli ühendust või helista!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const update = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <section id="contact" className="py-14 sm:py-16 md:py-20 relative">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 text-white">
          Võta ühendust
        </h2>
        <p className="text-center text-blue-200 mb-8 sm:mb-10 text-sm sm:text-base md:text-lg">
          Kirjuta, helista või täida vorm — vastame 24 tunni jooksul.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">

          <form
            onSubmit={handleSubmit}
            className="relative bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10"
          >
            {submitted && (
              <div className="absolute inset-0 bg-blue-600/95 rounded-2xl flex items-center justify-center z-10 px-4">
                <div className="text-white text-center">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-2xl font-bold">Aitäh!</div>
                  <p className="text-blue-100 text-sm mt-1">Võtame ühendust 24 tunni jooksul.</p>
                  {repairCode ? (
                    <div className="mt-4 bg-white/15 rounded-xl px-4 py-3 border border-white/25">
                      <div className="text-blue-100 text-xs uppercase tracking-wider">Sinu jälgimiskood</div>
                      <div className="text-xl font-mono font-bold tracking-wider mt-1 select-all">{repairCode}</div>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(repairCode)}
                        className="mt-2 text-xs underline underline-offset-2 bg-transparent border-none text-white cursor-pointer"
                      >
                        Kopeeri
                      </button>
                    </div>
                  ) : (
                    <p className="text-blue-100 text-xs mt-3">Jälgimiskoodi ei õnnestunud luua — helista ja saadame selle sulle.</p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <h3 className="text-xl sm:text-2xl font-bold mb-5 text-white">Broneeri remont</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium mb-1.5 text-blue-300">Nimi *</span>
                  <input
                    type="text" required value={formData.name} onChange={update('name')}
                    placeholder="Sinu nimi"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-white/40 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1.5 text-blue-300">Telefon *</span>
                  <input
                    type="tel" required value={formData.phone} onChange={update('phone')}
                    placeholder="5123 4567"
                    className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-white/40 text-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-sm font-medium mb-1.5 text-blue-300">E-post (soovi korral)</span>
                <input
                  type="email" value={formData.email} onChange={update('email')}
                  placeholder="sinu@email.ee"
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-white/40 text-sm"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium mb-1.5 text-blue-300">Teenus *</span>
                <select
                  required value={formData.service} onChange={update('service')}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white text-sm"
                >
                  <option value="" disabled>Vali teenus...</option>
                  <optgroup label="🎁 Hoolduspaketid">
                    <option value="Arvuti Põhipakett">Arvuti Põhipakett (35 €)</option>
                    <option value="Arvuti Hoolduspakett">Arvuti Hoolduspakett (60 €)</option>
                    <option value="Arvuti Täispakett">Arvuti Täispakett (90 €)</option>
                  </optgroup>
                  <optgroup label="🔧 Üksikteenused">
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </optgroup>
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-medium mb-1.5 text-blue-300">Seade</span>
                <input
                  type="text" value={formData.device} onChange={update('device')}
                  placeholder="nt iPhone 13, Dell Inspiron..."
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-white/40 text-sm"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium mb-1.5 text-blue-300">Probleemi kirjeldus</span>
                <textarea
                  rows="3" value={formData.problem} onChange={update('problem')}
                  placeholder="Kirjelda probleemi lühidalt..."
                  className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-white/40 text-sm resize-none"
                />
              </label>

              <button
                type="submit" disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                  isSubmitting
                    ? 'bg-slate-600 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                }`}
              >
                {isSubmitting ? 'Saadan...' : 'Saada remondipäring'}
              </button>

              <p className="text-xs md:text-sm text-blue-300/60 text-center">
                Võtame ühendust 24 tunni jooksul. Varuosa saadavuse täpsustame pärast diagnostikat.
              </p>
            </div>
          </form>

          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-blue-300 text-xs md:text-sm uppercase tracking-wide">Praegu</div>
                <div className="text-white font-semibold">
                  {open ? '✅ Avatud — helista julgelt' : '🌙 Suletud — jäta päring'}
                </div>
              </div>
              <a href="tel:+37258530404" className="text-blue-300 text-sm underline underline-offset-2">
                5853 0404
              </a>
            </div>

            {[
              { icon: '📍', title: 'Asukoht', text: 'F. R. Kreutzwaldi 58b, Võru', link: 'https://maps.google.com/?q=F.+R.+Kreutzwaldi+58b,+Võru' },
              { icon: '📞', title: 'Telefon', text: '+372 5853 0404', link: 'tel:+37258530404' },
              { icon: '✉️', title: 'E-post', text: 'info@nutifix.ee', link: 'mailto:info@nutifix.ee' },
            ].map((item) => (
              <a
                key={item.title} href={item.link || '#'}
                className="group flex items-center gap-4 bg-slate-800/50 rounded-xl p-5 border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <div className="text-blue-300 text-sm">{item.title}</div>
                  <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                    {item.text}
                  </div>
                </div>
              </a>
            ))}

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3">Lahtiolekuajad</h3>
              <div className="space-y-1.5 text-blue-200 text-sm">
                <div className="flex justify-between"><span>Esmaspäev – Reede</span><span className="text-white">9:00 – 18:00</span></div>
                <div className="flex justify-between"><span>Laupäev</span><span className="text-white">10:00 – 18:00</span></div>
                <div className="flex justify-between"><span>Pühapäev</span><span className="text-red-400">Suletud</span></div>
              </div>
              <a
                href="https://maps.google.com/?q=F.+R.+Kreutzwaldi+58b,+Võru"
                className="inline-block mt-4 text-blue-300 text-sm underline underline-offset-2"
              >
                Ava Google Mapsis →
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right .7rem center; background-repeat: no-repeat;
          background-size: 1.5em 1.5em; padding-right: 2.5rem; appearance: none;
        }
        select option, select optgroup { background-color: #1e293b; color: white; }
        select optgroup { font-weight: bold; color: #94a3b8; }
      `}</style>
    </section>
  )
}

export default Contact
