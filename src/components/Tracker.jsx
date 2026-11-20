import { useEffect, useState } from 'react'
import { STAGES, watchRepair } from '../repairs'

// Päris jälgimine: kood luuakse kontaktivormi saatmisel ja salvestatakse
// Firestore'i "repairs" kogumisse. NF-2026-DEMO näitab voogu ilma andmebaasita.

const ICONS = ['📨', '🔍', '✅', '🔧', '🎉']

function Tracker() {
  // Kui klient avab kirjas oleva lingi, on kood juba väljas.
  const linkedCode = () => {
    const m = window.location.hash.match(/^#status-(.+)$/)
    return m ? decodeURIComponent(m[1]).toUpperCase() : ''
  }
  const [code, setCode] = useState(linkedCode)
  const [activeCode, setActiveCode] = useState(linkedCode)
  const [repair, setRepair] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showReport, setShowReport] = useState(false)

  const isDemo = activeCode.toUpperCase() === 'NF-2026-DEMO'

  useEffect(() => {
    if (!activeCode || isDemo) return undefined
    setLoading(true)
    setError('')
    setRepair(null)
    const unsubscribe = watchRepair(
      activeCode,
      (value) => {
        setRepair(value)
        setLoading(false)
        if (!value) setError('Sellist koodi ei leitud. Kontrolli kirjapilti.')
      },
      () => {
        setError('Staatuse hankimine ebaõnnestus. Proovi hiljem uuesti.')
        setLoading(false)
      }
    )
    return unsubscribe
  }, [activeCode, isDemo])

  const rawIndex = isDemo ? 2 : Number(repair?.status ?? 0)
  const stageIndex = Math.max(0, Math.min(STAGES.length - 1, rawIndex))
  const current = activeCode && !error ? STAGES[stageIndex] : null

  const submit = (event) => {
    event.preventDefault()
    setError('')
    setRepair(null)
    setActiveCode(code.trim().toUpperCase())
  }

  return (
    <section id="status" className="nf-tracker-section relative">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="nf-eyebrow">JÄLGIMINE</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Vaata remondi staatust
          </h2>
          <p className="text-blue-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Sisesta päringu saamisel antud kood või proovi demokoodi <b>NF-2026-DEMO</b>.
            Päris staatuse saad alati ka telefoni või e-postiga.
          </p>
        </div>

        <div className="nf-tracker-card">
          <form onSubmit={submit} className="nf-tracker-form">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="NF-2026-XXXXX"
              aria-label="Remondi kood"
            />
            <button type="submit">Vaata staatust →</button>
          </form>

          {loading && <p className="text-blue-200 text-sm mt-4">Otsin koodi…</p>}
          {error && <p className="text-amber-300 text-sm mt-4">{error}</p>}

          {current && (
            <div className="nf-tracker-result">
              <div className="nf-tracker-head">
                <div>
                  <div className="nf-tracker-code">{isDemo ? 'Näidis tellimus' : `Kood: ${activeCode}`}</div>
                  <div className="nf-tracker-current">
                    <span>{ICONS[stageIndex]}</span> {current.title}
                  </div>
                  <p>{current.text}</p>
                  {repair && (
                    <div className="mt-2 space-y-2">
                      <p>
                        {repair.device && <>Seade: {repair.device}</>}
                        {repair.device && repair.service && ' · '}
                        {repair.service && <>Teenus: {repair.service}</>}
                      </p>
                      {repair.diagnosis && (
                        <div className="bg-slate-900/60 rounded-lg border border-white/10 px-3 py-2">
                          <div className="text-blue-300 text-xs uppercase tracking-wider mb-1">Diagnostika</div>
                          <p className="whitespace-pre-wrap break-words">{repair.diagnosis}</p>
                        </div>
                      )}
                      {repair.price && (
                        <div className="bg-blue-500/10 rounded-lg border border-blue-400/30 px-3 py-2">
                          <div className="text-blue-300 text-xs uppercase tracking-wider mb-1">Kinnitatud hind</div>
                          <p className="text-lg font-bold text-white break-words">{repair.price}</p>
                        </div>
                      )}
                      {repair.reportText && (
                        <button type="button" onClick={() => setShowReport(true)}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg border border-blue-400/40 bg-blue-500/10 text-blue-200 text-sm font-semibold hover:bg-blue-500/20 transition-colors">
                          Vaata diagnostika aruannet →
                          {repair.reportName && <span className="block text-xs font-normal text-blue-300/70 mt-0.5">{repair.reportName}</span>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="nf-tracker-pct">{Math.round(((stageIndex + 1) / STAGES.length) * 100)}%</div>
              </div>

              <div className="nf-tracker-steps">
                {STAGES.map((stage, index) => (
                  <div
                    key={stage.key}
                    className={`nf-tracker-step ${index < stageIndex ? 'done' : ''} ${index === stageIndex ? 'now' : ''}`}
                  >
                    <div className="nf-step-dot">{index < stageIndex ? '✓' : ICONS[index]}</div>
                    <div className="nf-step-copy">
                      <b>{stage.title}</b>
                      <span>{stage.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="nf-tracker-foot">
                <a href="#contact">Küsimused? Võta ühendust →</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReport && repair?.reportText && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm"
          role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowReport(false) }}>
          <div role="dialog" aria-modal="true" aria-label="Diagnostika aruanne"
            className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl border border-white/15 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10">
              <div>
                <div className="text-white font-bold">Diagnostika aruanne</div>
                <div className="text-blue-300 text-xs mt-0.5">{repair.reportName || 'Aruanne'}</div>
              </div>
              <button type="button" onClick={() => setShowReport(false)} aria-label="Sulge"
                className="text-slate-400 hover:text-white text-2xl leading-none bg-transparent border-none cursor-pointer p-1">×</button>
            </div>
            <pre className="flex-1 overflow-auto overscroll-contain px-5 py-4 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap break-words font-mono">
              {repair.reportText}
            </pre>
          </div>
        </div>
      )}

      <style>{`
        .nf-tracker-section { padding: 56px 0 64px; }
        .nf-eyebrow {
          display: inline-block; color: #38bdf8; border: 1px solid rgba(56,189,248,.35);
          border-radius: 999px; padding: 3px 12px; font-size: 11px; font-weight: 800;
          letter-spacing: .12em; margin-bottom: 12px;
        }
        .nf-tracker-card {
          background: rgba(30,41,59,.75); border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px; padding: 20px; backdrop-filter: blur(10px);
        }
        .nf-tracker-form { display: flex; flex-direction: column; gap: 10px; }
        .nf-tracker-form input {
          flex: 1; background: #0f172a; border: 1px solid rgba(255,255,255,.18);
          border-radius: 10px; padding: 12px 14px; color: #fff; font-family: inherit; font-size: 14px; outline: none;
        }
        .nf-tracker-form input:focus { border-color: #60a5fa; }
        .nf-tracker-form button {
          background: linear-gradient(90deg,#2563eb,#7c3aed); color: #fff; border: none;
          border-radius: 10px; padding: 12px 16px; font-weight: 800; cursor: pointer; transition: .2s;
        }
        .nf-tracker-form button:hover { filter: brightness(1.15); }
        .nf-tracker-result { margin-top: 20px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; }
        .nf-tracker-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
        .nf-tracker-code { font-size: 11px; color: #93c5fd; letter-spacing: .08em; text-transform: uppercase; font-weight: 800; }
        .nf-tracker-current { font-size: 20px; font-weight: 800; color: #fff; margin-top: 4px; }
        .nf-tracker-head p { font-size: 12px; color: rgba(219,234,254,.7); margin: 4px 0 0; }
        .nf-tracker-pct { font-size: 30px; font-weight: 900; color: #60a5fa; }
        .nf-tracker-steps { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .nf-tracker-step {
          display: flex; align-items: center; gap: 12px; padding: 10px 12px;
          background: rgba(15,23,42,.6); border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px; opacity: .55;
        }
        .nf-tracker-step.done, .nf-tracker-step.now { opacity: 1; }
        .nf-tracker-step.now { border-color: #60a5fa; background: rgba(59,130,246,.14); }
        .nf-step-dot {
          width: 34px; height: 34px; flex: 0 0 34px; border-radius: 9px;
          background: rgba(59,130,246,.2); display: flex; align-items: center; justify-content: center;
        }
        .nf-tracker-step.done .nf-step-dot { background: #3b82f6; color: #eff6ff; }
        .nf-step-copy { display: flex; flex-direction: column; }
        .nf-step-copy b { font-size: 13px; color: #fff; }
        .nf-step-copy span { font-size: 11px; color: rgba(219,234,254,.65); }
        .nf-tracker-foot { margin-top: 14px; font-size: 12px; }
        .nf-tracker-foot a { color: #93c5fd; text-decoration: none; }
        .nf-tracker-foot a:hover { text-decoration: underline; }

        @media (min-width: 640px) {
          .nf-tracker-section { padding: 72px 0 80px; }
          .nf-tracker-card { padding: 28px; }
          .nf-tracker-form { flex-direction: row; }
          .nf-tracker-steps { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 1024px) {
          .nf-tracker-steps { grid-template-columns: repeat(5,1fr); }
          .nf-step-copy span { display: none; }
          .nf-tracker-code { font-size: 13px; }
          .nf-tracker-head p { font-size: 14px; }
          .nf-step-copy b { font-size: 15px; }
          .nf-tracker-foot { font-size: 14px; }
        }
      `}</style>
    </section>
  )
}

export default Tracker
