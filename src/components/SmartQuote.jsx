import { useMemo, useState } from 'react'
import { sendQuote, serviceForQuoteLabel } from '../quoteBridge'

// Interaktiivne hinnapakkumise kalkulaator.
// Kõik hinnad pärinevad avalikust hinnakirjast; lõpliku hinna kinnitab
// NutiFix pärast tasuta diagnostikat.

const OPTIONS = [
  { group: 'Telefon', label: 'Ekraani vahetus (LCD)', price: 89, note: 'LCD-paneel, enamikul mudelitel' },
  { group: 'Telefon', label: 'Ekraani vahetus (OLED)', price: 149, note: 'OLED / AMOLED paneel' },
  { group: 'Telefon', label: 'Aku vahetus', price: 55, note: 'Originaal või kvaliteetne analoog' },
  { group: 'Arvuti', label: 'Põhipakett', price: 35, note: 'Tuvastamine, puhastus, termopasta' },
  { group: 'Arvuti', label: 'Hoolduspakett', price: 60, note: ' + SSD kontroll ja kiirendamine' },
  { group: 'Arvuti', label: 'Täispakett', price: 90, note: ' + süsteemi optimeerimine ja varundus' },
  { group: 'Arvuti', label: 'Sülearvuti ekraan', price: 95, note: 'standardne 14–15,6″ paneel' },
  { group: 'Kettad', label: 'HDD → SSD uuendus', price: 40, note: ' + SSD hind, andmete ülekandega' },
  { group: 'Kettad', label: 'Andmete päästmine', price: 150, note: 'Vigaselt kettalt, 150–350 €' },
  { group: 'Tugi', label: 'IT kiirabi (kohapeal)', price: 35, note: 'Tunnihind Võrus' },
  { group: 'Tugi', label: 'Kaugabi', price: 25, note: 'Tunnihind' },
  { group: 'Tugi', label: 'Windowsi paigaldus', price: 50, note: 'Puhas paigaldus' },
]

const GROUPS = ['Kõik', 'Telefon', 'Arvuti', 'Kettad', 'Tugi']

function smartRound(value) {
  return Math.round(value / 5) * 5
}

function SmartQuote() {
  const [group, setGroup] = useState('Kõik')
  const [selected, setSelected] = useState([])
  const [timeline, setTimeline] = useState('standard')
  const [device, setDevice] = useState('')

  const visible = useMemo(
    () => (group === 'Kõik' ? OPTIONS : OPTIONS.filter((o) => o.group === group)),
    [group]
  )

  const subtotal = useMemo(
    () => selected.reduce((sum, item) => sum + item.price, 0),
    [selected]
  )

  // Tähtaeg ei muuda hinda — varuosa saadavus sõltub tarnijast, mitte kiirusest.
  const total = smartRound(subtotal)

  const pushToForm = (selection) => {
    const chosen = selection.length
      ? selection.map((item) => item.label).join(', ')
      : 'Tasuta diagnostika / personaalne pakkumine'
    const amount = selection.reduce((sum, item) => sum + item.price, 0)
    sendQuote({
      service: selection.length === 1 ? serviceForQuoteLabel(selection[0].label) : 'Muu / Ei ole kindel',
      device,
      message: `Kalkulaatori pakkumine: ${chosen}. Seade: ${device || 'määramata'}. `
        + `Hinnang: ${smartRound(amount)}€. Ajaline soov: ${timeline}. `
        + `Varuosa saadavus ja lõplik hind kinnitatakse pärast diagnostikat.`,
    })
  }

  const toggle = (option) => {
    const next = selected.some((item) => item.label === option.label)
      ? selected.filter((item) => item.label !== option.label)
      : [...selected, option]
    setSelected(next)
    // Iga valik täidab päringu väljad kohe, ilma eraldi nuputa.
    pushToForm(next)
  }

  const askQuote = () => {
    pushToForm(selected)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const reset = () => {
    setSelected([])
    setDevice('')
    setTimeline('standard')
    setGroup('Kõik')
  }

  return (
    <section id="quote" className="nf-quote-section relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="nf-eyebrow">INTERAKTIIVNE</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Koosta oma remondipakkumine
          </h2>
          <p className="text-blue-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Vali teenused, lisa seade ja näe hinnangulist maksumust kohe.
            Diagnostika on tasuta — lõpliku hinna kinnitame pärast ülevaatust.
          </p>
        </div>

        <div className="nf-quote-grid">
          <div className="nf-quote-main">
            <div className="nf-quote-toolbar">
              {GROUPS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGroup(item)}
                  className={`nf-chip ${group === item ? 'active' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="nf-quote-options">
              {visible.map((option) => {
                const isSelected = selected.some((item) => item.label === option.label)
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => toggle(option)}
                    className={`nf-quote-option ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="nf-quote-check">{isSelected ? '✓' : '+'}</span>
                    <span className="nf-quote-option-copy">
                      <span className="nf-quote-option-title">{option.label}</span>
                      <span className="nf-quote-option-note">{option.note}</span>
                    </span>
                    <span className="nf-quote-option-price">{option.price}€</span>
                  </button>
                )
              })}
            </div>

            <div className="nf-quote-fields">
              <label>
                <span>Seade (valikuline)</span>
                <input
                  type="text"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  placeholder="nt iPhone 13, Dell Inspiron 15"
                />
              </label>
              <label>
                <span>Ajaline soov</span>
                <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
                  <option value="standard">Standard — 3–5 tööpäeva</option>
                  <option value="parts">Varuosa tellimusel — täpsustame</option>
                  <option value="flexible">Ei ole kiire — sobib ka nädal</option>
                </select>
              </label>
            </div>
          </div>

          <aside className="nf-quote-summary">
            <div className="nf-summary-label">Sinu pakkumine</div>
            <div className="nf-summary-total">{total}€</div>
            <div className="nf-summary-note">Hinnanguline hind tööjõule</div>

            <div className="nf-summary-lines">
              {selected.length === 0 && <div className="nf-summary-empty">Vali ülal vähemalt üks teenus.</div>}
              {selected.map((item) => (
                <div key={item.label} className="nf-summary-line">
                  <span>{item.label}</span>
                  <b>{item.price}€</b>
                </div>
              ))}
            </div>

            <button type="button" className="nf-summary-cta" onClick={askQuote}>
              Küsi seda pakkumist →
            </button>
            <button type="button" className="nf-summary-reset" onClick={reset}>
              Tühjenda valikud
            </button>
            <p className="nf-summary-fine">
              Varuosa hind sõltub mudelist ja tarnijast ning lisandub tööjõule. Täpse koguhinna kinnitame pärast tasuta diagnostikat.
            </p>
          </aside>
        </div>
      </div>

      <style>{`
        .nf-quote-section { padding: 56px 0 64px; }
        .nf-eyebrow {
          display: inline-block; color: #38bdf8; border: 1px solid rgba(56,189,248,.35);
          border-radius: 999px; padding: 3px 12px; font-size: 11px; font-weight: 800;
          letter-spacing: .12em; margin-bottom: 12px;
        }
        .nf-quote-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .nf-quote-main, .nf-quote-summary {
          background: rgba(30,41,59,.75); border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px; padding: 18px; backdrop-filter: blur(10px);
        }
        .nf-quote-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .nf-chip {
          background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.14);
          color: #cbd5e1; border-radius: 999px; padding: 6px 13px; font-size: 12px;
          font-weight: 700; cursor: pointer; transition: .2s;
        }
        .nf-chip:hover, .nf-chip.active {
          border-color: #3b82f6; background: rgba(59,130,246,.2); color: #fff;
        }
        .nf-quote-options { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .nf-quote-option {
          display: flex; align-items: center; gap: 10px; width: 100%; text-align: left;
          background: rgba(15,23,42,.7); border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px; padding: 11px 13px; color: #fff; cursor: pointer; transition: .2s;
        }
        .nf-quote-option:hover { border-color: rgba(96,165,250,.55); transform: translateX(3px); }
        .nf-quote-option.selected { border-color: #60a5fa; background: rgba(59,130,246,.18); }
        .nf-quote-check {
          width: 24px; height: 24px; flex: 0 0 24px; border-radius: 7px;
          background: rgba(59,130,246,.25); color: #93c5fd; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .nf-quote-option.selected .nf-quote-check { background: #3b82f6; color: #fff; }
        .nf-quote-option-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .nf-quote-option-title { font-size: 13px; font-weight: 700; }
        .nf-quote-option-note { font-size: 11px; color: rgba(219,234,254,.65); }
        .nf-quote-option-price { font-weight: 800; color: #93c5fd; white-space: nowrap; }
        .nf-quote-fields { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 16px; }
        .nf-quote-fields label { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #93c5fd; font-weight: 700; }
        .nf-quote-fields input, .nf-quote-fields select {
          background: #0f172a; border: 1px solid rgba(255,255,255,.18); border-radius: 9px;
          padding: 11px 12px; color: #fff; font-family: inherit; font-size: 14px; outline: none;
        }
        .nf-quote-fields input:focus, .nf-quote-fields select:focus { border-color: #60a5fa; }
        .nf-summary-label { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #93c5fd; font-weight: 800; }
        .nf-summary-total { font-size: 52px; line-height: 1.1; font-weight: 900; color: #fff; margin: 4px 0; }
        .nf-summary-note { font-size: 12px; color: rgba(226,232,240,.7); }
        .nf-summary-lines { margin: 18px 0; border-top: 1px solid rgba(255,255,255,.1); padding-top: 12px; }
        .nf-summary-line { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; color: #dbeafe; padding: 5px 0; }
        .nf-summary-line b { color: #fff; }
        .nf-summary-line.extra { color: #fbbf24; }
        .nf-summary-empty { color: rgba(148,163,184,.9); font-size: 12px; padding: 8px 0; }
        .nf-summary-cta {
          width: 100%; border: none; border-radius: 11px; padding: 13px; cursor: pointer;
          background: linear-gradient(90deg, #2563eb, #7c3aed); color: #fff; font-weight: 800; font-size: 14px;
          transition: .2s;
        }
        .nf-summary-cta:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .nf-summary-reset {
          width: 100%; margin-top: 8px; background: transparent; border: 1px solid rgba(255,255,255,.16);
          color: #cbd5e1; border-radius: 10px; padding: 9px; cursor: pointer; font-size: 12px;
        }
        .nf-summary-fine { font-size: 12px; color: rgba(148,163,184,.8); margin: 12px 0 0; text-align: center; }

        @media (min-width: 768px) {
          .nf-quote-section { padding: 72px 0 80px; }
          .nf-quote-grid { grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: start; }
          .nf-quote-main, .nf-quote-summary { padding: 24px; }
          .nf-quote-options { grid-template-columns: 1fr 1fr; }
          .nf-quote-fields { grid-template-columns: 1fr 1fr; }
          .nf-summary-total { font-size: 64px; }
        }
        @media (min-width: 1024px) {
          .nf-quote-option-title { font-size: 14px; }
          .nf-quote-option-note { font-size: 12.5px; }
          .nf-quote-fields label { font-size: 13.5px; }
          .nf-summary-label { font-size: 12.5px; }
          .nf-summary-note, .nf-summary-line, .nf-summary-empty { font-size: 13.5px; }
          .nf-summary-reset { font-size: 13px; }
          .nf-summary-fine { font-size: 13px; }
        }
        @media (min-width: 1280px) {
          .nf-quote-section { padding: 88px 0 96px; }
          .nf-quote-options { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </section>
  )
}

export default SmartQuote
