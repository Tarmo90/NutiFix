import { useState } from 'react'

const ITEMS = [
  {
    q: 'Kui palju remont maksab?',
    a: 'Hinnad on hinnakirjas töö kaupa. Varuosa hind on iga töö juures eraldi kirjas. Täpse hinna kinnitame pärast seadme ülevaatust.',
  },
  {
    q: 'Kui kaua remont aega võtab?',
    a: 'Remondiaeg sõltub rikkest, seadme mudelist ja varuosa saadavusest. Enamik töid valmib 3–5 tööpäeva jooksul; kui varuosa tuleb tellida, ütleme täpse aja pärast ülevaatust.',
  },
  {
    q: 'Kui pikk on remondi garantii?',
    a: 'Kõigile NutiFixi tehtud remonditöödele ja vahetatud varuosadele kehtib 3 kuud garantii. Garantii algab seadme üleandmisest.',
  },
  {
    q: 'Kuidas remondipäring saata?',
    a: 'Täida kontaktivormis nimi, telefon ja soovitud teenus — või kasuta lehel olevat hinnakalkulaatorit. Võtame ühendust 24 tunni jooksul. Võid ka helistada või kirjutada e-postile.',
  },
  {
    q: 'Kus NutiFix asub?',
    a: 'NutiFix asub aadressil F. R. Kreutzwaldi 58b, 65610 Võru. Kontaktiosast saad asukoha avada Google Mapsis.',
  },
  {
    q: 'Kas diagnostika on tasuta?',
    a: 'Jah. Esmane diagnostika on tasuta. Täpne hind ja tööde maht kinnitatakse enne remondi algust, ilma üllatuseta.',
  },
]

function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="nf-faq-section relative">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="nf-eyebrow">KKK</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Korduma kippuvad küsimused
          </h2>
          <p className="text-blue-200 text-sm sm:text-base md:text-lg">
            Kiired vastused remondi, hinna ja garantii kohta.
          </p>
        </div>

        <div className="nf-faq-list">
          {ITEMS.map((item, index) => {
            const isOpen = open === index
            return (
              <div key={item.q} className={`nf-faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="nf-faq-num">{String(index + 1).padStart(2, '0')}</span>
                  <span className="nf-faq-q">{item.q}</span>
                  <span className="nf-faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="nf-faq-answer" style={{ maxHeight: isOpen ? '260px' : '0px' }}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .nf-faq-section { padding: 56px 0 64px; }
        .nf-eyebrow {
          display: inline-block; color: #38bdf8; border: 1px solid rgba(56,189,248,.35);
          border-radius: 999px; padding: 3px 12px; font-size: 11px; font-weight: 800;
          letter-spacing: .12em; margin-bottom: 12px;
        }
        .nf-faq-list { display: flex; flex-direction: column; gap: 10px; }
        .nf-faq-item {
          background: rgba(30,41,59,.75); border: 1px solid rgba(255,255,255,.12);
          border-radius: 14px; overflow: hidden; transition: .25s;
        }
        .nf-faq-item.open { border-color: rgba(96,165,250,.55); background: rgba(30,41,59,.9); }
        .nf-faq-item button {
          width: 100%; display: flex; align-items: center; gap: 12px; text-align: left;
          background: transparent; border: none; color: #fff; padding: 16px 18px; cursor: pointer;
        }
        .nf-faq-num { font-size: 11px; color: #60a5fa; font-weight: 800; }
        .nf-faq-q { flex: 1; font-size: 14px; font-weight: 700; }
        .nf-faq-toggle { font-size: 22px; color: #93c5fd; line-height: 1; }
        .nf-faq-answer { overflow: hidden; transition: max-height .35s ease; }
        .nf-faq-answer p {
          margin: 0; padding: 0 18px 18px 48px; color: rgba(219,234,254,.78); font-size: 13px; line-height: 1.7;
        }
        @media (min-width: 768px) {
          .nf-faq-section { padding: 72px 0 80px; }
          .nf-faq-q { font-size: 16px; }
        }
      `}</style>
    </section>
  )
}

export default Faq
