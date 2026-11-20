import { useMemo, useState } from 'react'

// Demo-staatuse jälgija. Proovikood NF-2026-DEMO näitab kogu voogu.
// Päris tellimuse staatuse saab kliendilt telefoni või e-postiga.

const STAGES = [
  { key: 'received', title: 'Päring vastu võetud', icon: '📨', text: 'Sinu remondipäring on meil olemas.' },
  { key: 'diagnosis', title: 'Tasuta diagnostika', icon: '🔍', text: 'Seadme ülevaatus ja täpse hinna kinnitus.' },
  { key: 'approved', title: 'Hind kinnitatud', icon: '✅', text: 'Ootame sinu nõusolekut töö alustamiseks.' },
  { key: 'repair', title: 'Remont käib', icon: '🔧', text: 'Tehnik teeb töö ja kontrollib tulemust.' },
  { key: 'ready', title: 'Valmis üleandmiseks', icon: '🎉', text: 'Sea saab kätte, garantii algab.' },
]

function hashStep(code) {
  let hash = 0
  for (let i = 0; i < code.length; i += 1) hash = (hash * 31 + code.charCodeAt(i)) % 997
  return hash % STAGES.length
}

function Tracker() {
  const [code, setCode] = useState('')
  const [activeCode, setActiveCode] = useState('')

  const stageIndex = useMemo(
    () => (activeCode ? hashStep(activeCode.toUpperCase()) : -1),
    [activeCode]
  )

  const isDemo = activeCode.toUpperCase() === 'NF-2026-DEMO'
  const current = stageIndex >= 0 ? STAGES[stageIndex] : null

  const submit = (event) => {
    event.preventDefault()
    setActiveCode(code.trim())
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
            Sisesta oma päringu kood või proovi demokoodi <b>NF-2026-DEMO</b>.
            Päris staatuse saad alati ka telefoni või e-postiga.
          </p>
        </div>

        <div className="nf-tracker-card">
          <form onSubmit={submit} className="nf-tracker-form">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="NF-2026-DEMO"
              aria-label="Remondi kood"
            />
            <button type="submit">Vaata staatust →</button>
          </form>

          {current && (
            <div className="nf-tracker-result">
              <div className="nf-tracker-head">
                <div>
                  <div className="nf-tracker-code">{isDemo ? 'Näidis tellimus' : `Kood: ${activeCode}`}</div>
                  <div className="nf-tracker-current">
                    <span>{current.icon}</span> {current.title}
                  </div>
                  <p>{current.text}</p>
                </div>
                <div className="nf-tracker-pct">{Math.round(((stageIndex + 1) / STAGES.length) * 100)}%</div>
              </div>

              <div className="nf-tracker-steps">
                {STAGES.map((stage, index) => (
                  <div
                    key={stage.key}
                    className={`nf-tracker-step ${index < stageIndex ? 'done' : ''} ${index === stageIndex ? 'now' : ''}`}
                  >
                    <div className="nf-step-dot">{index < stageIndex ? '✓' : stage.icon}</div>
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
        .nf-tracker-step.done .nf-step-dot { background: #22c55e; color: #052e16; }
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
        }
      `}</style>
    </section>
  )
}

export default Tracker
