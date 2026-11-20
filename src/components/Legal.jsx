import { useEffect } from 'react'

const CONTENT = {
  privacy: {
    title: 'Privaatsuspoliitika',
    updated: 'Viimati uuendatud: 20. november 2026',
    body: [
      { h: 'Kes me oleme', p: 'NutiFix OÜ, F. R. Kreutzwaldi 58b, 65610 Võru. Vastutav isik: info@nutifix.ee, +372 5853 0404.' },
      { h: 'Milliseid andmeid kogume', p: 'Kontaktivormist: nimi, telefon, e-post (soovi korral), valitud teenus, seade ja probleemi kirjeldus. Arvustuse vormist: nimi, hinnang ja arvustuse tekst.' },
      { h: 'Miks me neid kogume', p: 'Ainult selleks, et vastata sinu remondipäringule ja kuvada arvustusi lehel. Me ei müü ega edasta andmeid kolmandatele osapooltele reklaami eesmärgil.' },
      { h: 'Kus andmed asuvad', p: 'Päringud edastatakse Formspree kaudu meie e-postile. Arvustused salvestatakse Firebase Firestore’is (Google Cloud, ELi piirkond). Lehe majutaja Firebase Hosting võib pidada standardseid serverilogisid.' },
      { h: 'Küpsised', p: 'Me ei kasuta reklaami- ega analüütikaküpsiseid. Ainus küpsis on sinu nõusoleku meelespidamine sellel seadmel (localStorage). Selle saad igal ajal kustutada brauseri andmetest.' },
      { h: 'Sinu õigused', p: 'Saad taotleda oma andmete väljastamist, parandamist või kustutamist, kirjutades aadressile info@nutifix.ee. Vastame 30 päeva jooksul.' },
      { h: 'Säilitamine', p: 'Päringuid hoitakse seni, kuni remonditöö ja garantiiaeg on lõppenud. Arvustused jäävad lehele, kui sa ei palu neid kustutada.' },
    ],
  },
  terms: {
    title: 'Kasutustingimused',
    updated: 'Viimati uuendatud: 20. november 2026',
    body: [
      { h: 'Hinnad', p: 'Lehel ja kalkulaatoris toodud hinnad on orienteeruvad. Lõplik hind kinnitatakse pärast tasuta esmast diagnoosi ja varuosa saadavuse kontrolli.' },
      { h: 'Päring ei ole broneering', p: 'Vormi saatmine või ajavaliku märkimine ei broneeri aega. Remondiaeg loeb kinnitatuks alles siis, kui me sinuga telefoni või e-postiga ühendust võtame ja kokku lepime.' },
      { h: 'Garantii', p: 'Kõigile tehtud remonditöödele ja vahetatud varuosadele anname 3 kuud garantii. Garantii algab seadme üleandmisest ja märgitakse remondiaktile.' },
      { h: 'Andmete turvalisus', p: 'Palun ära saada vormi kaudu parool või muud tundlikku teavet. Andmete töötlemist kirjeldab privaatsuspoliitika.' },
      { h: 'Arvustused', p: 'Arvustused avaldatakse pärast saatmist kohe. Me ei avalda valeväiteid ega eemalda arvustusi põhjuseta. Võime eemaldada sobimatu sisu.' },
      { h: 'Kontakt', p: 'Küsimuste korral: info@nutifix.ee või +372 5853 0404.' },
    ],
  },
}

function Legal({ type, onClose }) {
  useEffect(() => {
    if (!type) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [type, onClose])

  if (!type) return null
  const doc = CONTENT[type]
  if (!doc) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-slate-900 p-5 sm:p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Sulge"
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer p-1"
        >
          ×
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-white pr-10">{doc.title}</h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1 mb-6">{doc.updated}</p>

        <div className="space-y-5">
          {doc.body.map((section) => (
            <section key={section.h}>
              <h3 className="text-blue-300 font-semibold mb-1.5">{section.h}</h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{section.p}</p>
            </section>
          ))}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm transition-all"
        >
          Sulge
        </button>
      </div>
    </div>
  )
}

export default Legal
