import { useMemo, useState } from 'react'
import { sendQuote } from '../quoteBridge'

// Kliendi poolt märgitud telefoni seisukord -> töö raskusaste ja
// hinnanguline lisand tööjõule. Lõpliku hinna kinnitab NutiFix diagnostikal.
// Kui klient märgib mõrades ekraani, on aku vahetus keerulisem: klaas
// võib töö käigus puruneda ja tuleb katta ning ettevaatlikult käsitseda.

const GROUPS = [
  {
    id: 'screen',
    title: 'Ekraan',
    question: 'Kuidas ekraan välja näeb?',
    options: [
      { id: 'ok', label: 'Terve', detail: 'Klaas terve, puude töötab', weight: 0, extra: 0 },
      { id: 'cracks', label: 'Mõrad', detail: 'Klaas on mõranenud, puude töötab', weight: 1, extra: 10,
        why: 'Mõrades ekraan tuleb aku vahetuse ajal katta — klaas võib surve all veel puruneda.' },
      { id: 'broken', label: 'Purunenud', detail: 'Klaas on purunenud, võib olla kilde', weight: 2, extra: 20,
        why: 'Enne akut või muid töid tuleb klaas ohutult eemaldada ja kildudest puhastada.' },
      { id: 'touch', label: 'Puude ei tööta', detail: 'Osa ekraanist ei reageeri', weight: 2, extra: 15,
        why: 'Viga võib olla paneelis, konektoris või kontrolleris — diagnoos võtab kauem.' },
    ],
  },
  {
    id: 'battery',
    title: 'Aku',
    question: 'Kuidas aku käitub?',
    options: [
      { id: 'ok', label: 'Korras', detail: 'Peab laadimise korral vastu', weight: 0, extra: 0 },
      { id: 'drain', label: 'Tühjeneb kiiresti', detail: 'Mahutavus on langenud', weight: 1, extra: 0,
        why: 'Aku vahetus on lihtne, kui klaas ja korpus on terved.' },
      { id: 'nocharge', label: 'Ei lae või lülitub välja', detail: 'Vaja kontrollida ka laadimisahelat', weight: 2, extra: 10,
        why: 'Põhjus võib olla aku asemel port või toiteahel — lisandub mõõtmine.' },
      { id: 'swollen', label: 'Paistetanud', detail: 'Aku on deformeerunud või tõstab ekraani', weight: 3, extra: 25,
        why: 'Paistetanud aku on ohtlik: töö nõuab erivahendeid ja ettevaatust.' },
    ],
  },
  {
    id: 'body',
    title: 'Korpus',
    question: 'Kas korpus või tagakaas on kahjustatud?',
    options: [
      { id: 'ok', label: 'Terve', detail: 'Raam sirge, tagakaas terve', weight: 0, extra: 0 },
      { id: 'scratches', label: 'Kriimud', detail: 'Kosmeetiline viga', weight: 0, extra: 0 },
      { id: 'bent', label: 'Raam paindunud', detail: 'Tihend ei pruugi korralikult istuda', weight: 2, extra: 15,
        why: 'Paindunud raam takistab uue tihendi paigaldamist ja võib mõjutada antenni.' },
      { id: 'back', label: 'Tagakaas purunenud', detail: 'Vaja vahetada ka tagakaas', weight: 2, extra: 15,
        why: 'Purunenud tagakaas tuleb enne kokkupanekut vahetada.' },
    ],
  },
  {
    id: 'water',
    title: 'Vesi',
    question: 'Kas seade on olnud vees või niiskes kohas?',
    options: [
      { id: 'no', label: 'Ei ole olnud', detail: 'Tavaline kasutus', weight: 0, extra: 0 },
      { id: 'humid', label: 'Oli niiskes kohas', detail: 'Nt vannituba, vihma', weight: 2, extra: 15,
        why: 'Niiskus võib olla jäänud konektoritesse — vaja kuivatada ja kontrollida.' },
      { id: 'water', label: 'Kukkus vette', detail: 'Täielikult või osaliselt märg', weight: 3, extra: 30,
        why: 'Enne remonti tuleb seade kuivatada ja puhastada korrosioonist.' },
    ],
  },
]

const LEVELS = [
  { max: 0, label: 'Lihtne', color: '#4ade80', note: 'Standardne töö, eritingimusi pole.' },
  { max: 1, label: 'Keskmine', color: '#fbbf24', note: 'Väike lisatöö, aga seade on ohutu käsitseda.' },
  { max: 2, label: 'Keeruline', color: '#fb923c', note: 'Töö nõuab ettevaatust ja lisaaega.' },
  { max: 3, label: 'Eriline tähelepanu', color: '#f87171', note: 'Vaja erivahendeid ja pikemat diagnostikat.' },
]

function levelFor(weight) {
  return LEVELS.find((item) => weight <= item.max) || LEVELS[LEVELS.length - 1]
}

function ConditionCheck() {
  const [choices, setChoices] = useState({})
  const [device, setDevice] = useState('')

  const selected = useMemo(
    () => GROUPS.map((group) => ({
      group,
      option: group.options.find((o) => o.id === choices[group.id]),
    })).filter((entry) => entry.option),
    [choices]
  )

  const weight = selected.reduce((max, entry) => Math.max(max, entry.option.weight), 0)
  const extra = selected.reduce((sum, entry) => sum + entry.option.extra, 0)
  const level = levelFor(weight)

  const pick = (groupId, option) => {
    const next = { ...choices, [groupId]: option.id }
    setChoices(next)
    pushToForm(next, device)
  }

  const changeDevice = (value) => {
    setDevice(value)
    if (selected.length) pushToForm(choices, value)
  }

  const pushToForm = (current, currentDevice) => {
    const lines = GROUPS.map((group) => {
      const option = group.options.find((o) => o.id === current[group.id])
      return option ? `${group.title}: ${option.label}${option.extra ? ` (+${option.extra} €)` : ''}` : null
    }).filter(Boolean)
    const reasons = GROUPS.map((group) => {
      const option = group.options.find((o) => o.id === current[group.id])
      return option && option.why ? option.why : null
    }).filter(Boolean)
    const chosenWeight = GROUPS.reduce((max, group) => {
      const option = group.options.find((o) => o.id === current[group.id])
      return option ? Math.max(max, option.weight) : max
    }, 0)
    const chosenExtra = GROUPS.reduce((sum, group) => {
      const option = group.options.find((o) => o.id === current[group.id])
      return sum + (option ? option.extra : 0)
    }, 0)
    const battery = current.battery
    const batteryBad = battery && battery !== 'ok'
    const screenBad = current.screen && current.screen !== 'ok'
    const service = batteryBad
      ? 'Mobiiltelefonide aku vahetus'
      : screenBad
        ? 'Mobiiltelefonide ekraani vahetus'
        : 'Muu / Ei ole kindel'
    const message = [
      lines.length ? `Seisukorra kontroll: ${lines.join('; ')}.` : 'Seisukorda veel ei ole märgitud.',
      `Töö raskusaste: ${levelFor(chosenWeight).label}.`,
      `Hinnanguline lisand tööjõule: ${chosenExtra} €.`,
      reasons.length ? `Miks: ${reasons.join(' ')}` : '',
      `Seade: ${currentDevice || 'määramata'}.`,
      'Varuosa hind ja lõplik hind kinnitatakse pärast tasuta diagnostikat.',
    ].filter(Boolean).join(' ')
    sendQuote({ service, device: currentDevice || '', message })
  }

  const ask = () => {
    pushToForm(choices, device)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const reset = () => {
    setChoices({})
    setDevice('')
  }

  return (
    <section id="condition" className="nf-condition-section relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <div className="nf-eyebrow">SEISUKORD</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Kirjelda oma telefoni seisukorda
          </h2>
          <p className="text-blue-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Märgi, mis on katki. Saad kohe teada, kui keeruline on remont ja
            kui palju see tööjõule lisaks tuleb — veel enne kui me seadet näeme.
          </p>
        </div>

        <div className="nf-condition-grid">
          <div className="nf-condition-main">
            {GROUPS.map((group) => (
              <div key={group.id} className="nf-condition-group">
                <div className="nf-condition-head">
                  <span className="nf-condition-index">{String(GROUPS.indexOf(group) + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="nf-condition-title">{group.title}</div>
                    <div className="nf-condition-question">{group.question}</div>
                  </div>
                </div>
                <div className="nf-condition-options">
                  {group.options.map((option) => {
                    const active = choices[group.id] === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => pick(group.id, option)}
                        className={`nf-condition-option ${active ? 'selected' : ''}`}
                      >
                        <span className="nf-condition-dot">{active ? '✓' : ''}</span>
                        <span className="nf-condition-copy">
                          <span className="nf-condition-label">{option.label}</span>
                          <span className="nf-condition-detail">{option.detail}</span>
                        </span>
                        {option.extra > 0 && (
                          <span className="nf-condition-price">+{option.extra} €</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <label className="nf-condition-device">
              <span>Seade (valikuline)</span>
              <input
                type="text"
                value={device}
                onChange={(e) => changeDevice(e.target.value)}
                placeholder="nt iPhone 13, Samsung S23"
              />
            </label>
          </div>

          <aside className="nf-condition-summary">
            <div className="nf-summary-label">Sinu seisukord</div>
            <div className="nf-condition-level" style={{ color: level.color }}>{level.label}</div>
            <div className="nf-condition-note">{level.note}</div>

            <div className="nf-condition-extra">
              <span>Hinnanguline lisand tööjõule</span>
              <b>{extra} €</b>
            </div>

            <div className="nf-condition-lines">
              {selected.length === 0 && (
                <div className="nf-summary-empty">Vali ülal vähemalt üks seisukord.</div>
              )}
              {selected.map(({ group, option }) => (
                <div key={group.id} className="nf-condition-line">
                  <span>{group.title}: {option.label}</span>
                  <b>{option.extra ? `+${option.extra} €` : '—'}</b>
                </div>
              ))}
            </div>

            {selected.some(({ option }) => option.why) && (
              <div className="nf-condition-reasons">
                {selected.filter(({ option }) => option.why).map(({ group, option }) => (
                  <p key={group.id}><b>{group.title}:</b> {option.why}</p>
                ))}
              </div>
            )}

            <button type="button" className="nf-summary-cta" onClick={ask}>
              Saada see teave päringuga →
            </button>
            <button type="button" className="nf-summary-reset" onClick={reset}>
              Tühjenda valikud
            </button>
            <p className="nf-summary-fine">
              See on hinnang, mitte lõplik hind. Varuosa hind ja täpne töömaht
              kinnitatakse pärast tasuta diagnostikat.
            </p>
          </aside>
        </div>
      </div>

      <style>{`
        .nf-condition-section { padding: 56px 0 64px; }
        .nf-condition-section .nf-eyebrow {
          display: inline-block; color: #38bdf8; border: 1px solid rgba(56,189,248,.35);
          border-radius: 999px; padding: 3px 12px; font-size: 11px; font-weight: 800;
          letter-spacing: .12em; margin-bottom: 12px;
        }
        .nf-condition-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        .nf-condition-main, .nf-condition-summary {
          background: rgba(30,41,59,.75); border: 1px solid rgba(255,255,255,.12);
          border-radius: 18px; padding: 18px; backdrop-filter: blur(10px);
        }
        .nf-condition-group + .nf-condition-group { margin-top: 18px; border-top: 1px solid rgba(255,255,255,.1); padding-top: 18px; }
        .nf-condition-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .nf-condition-index {
          width: 26px; height: 26px; flex: 0 0 26px; border-radius: 8px;
          background: rgba(59,130,246,.2); color: #93c5fd; font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .nf-condition-title { font-size: 14px; font-weight: 800; color: #fff; }
        .nf-condition-question { font-size: 11.5px; color: rgba(219,234,254,.65); }
        .nf-condition-options { display: grid; grid-template-columns: 1fr; gap: 7px; }
        .nf-condition-option {
          display: flex; align-items: center; gap: 10px; width: 100%; text-align: left;
          background: rgba(15,23,42,.7); border: 1px solid rgba(255,255,255,.1);
          border-radius: 11px; padding: 10px 12px; color: #fff; cursor: pointer; transition: .2s;
        }
        .nf-condition-option:hover { border-color: rgba(96,165,250,.55); transform: translateX(3px); }
        .nf-condition-option.selected { border-color: #60a5fa; background: rgba(59,130,246,.18); }
        .nf-condition-dot {
          width: 20px; height: 20px; flex: 0 0 20px; border-radius: 6px;
          background: rgba(59,130,246,.25); color: #93c5fd; font-size: 11px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
        }
        .nf-condition-option.selected .nf-condition-dot { background: #3b82f6; color: #fff; }
        .nf-condition-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .nf-condition-label { font-size: 12.5px; font-weight: 700; }
        .nf-condition-detail { font-size: 10.5px; color: rgba(219,234,254,.6); }
        .nf-condition-price { font-weight: 800; color: #fbbf24; white-space: nowrap; font-size: 12px; }
        .nf-condition-device { display: flex; flex-direction: column; gap: 6px; margin-top: 16px; font-size: 12px; color: #93c5fd; font-weight: 700; }
        .nf-condition-device input {
          background: #0f172a; border: 1px solid rgba(255,255,255,.18); border-radius: 9px;
          padding: 11px 12px; color: #fff; font-family: inherit; font-size: 14px; outline: none;
        }
        .nf-condition-device input:focus { border-color: #60a5fa; }
        .nf-condition-level { font-size: 38px; line-height: 1.15; font-weight: 900; margin: 4px 0; }
        .nf-condition-note { font-size: 12px; color: rgba(226,232,240,.7); }
        .nf-condition-extra {
          display: flex; justify-content: space-between; align-items: center; gap: 12px;
          margin: 18px 0 0; padding: 12px 0; border-top: 1px solid rgba(255,255,255,.1);
          font-size: 12.5px; color: #dbeafe;
        }
        .nf-condition-extra b { font-size: 22px; color: #fbbf24; }
        .nf-condition-lines { border-top: 1px solid rgba(255,255,255,.1); padding-top: 12px; }
        .nf-condition-line { display: flex; justify-content: space-between; gap: 12px; font-size: 12px; color: #dbeafe; padding: 5px 0; }
        .nf-condition-line b { color: #fff; white-space: nowrap; }
        .nf-condition-reasons {
          margin-top: 12px; background: rgba(251,191,36,.08); border: 1px solid rgba(251,191,36,.25);
          border-radius: 10px; padding: 10px 12px;
        }
        .nf-condition-reasons p { font-size: 11px; line-height: 1.5; color: rgba(254,243,199,.85); margin: 0 0 6px; }
        .nf-condition-reasons p:last-child { margin-bottom: 0; }
        .nf-condition-summary .nf-summary-cta {
          width: 100%; border: none; border-radius: 11px; padding: 13px; cursor: pointer;
          background: linear-gradient(90deg, #2563eb, #7c3aed); color: #fff; font-weight: 800; font-size: 14px;
          transition: .2s; margin-top: 18px;
        }
        .nf-condition-summary .nf-summary-cta:hover { filter: brightness(1.15); transform: translateY(-1px); }
        .nf-condition-summary .nf-summary-reset {
          width: 100%; margin-top: 8px; background: transparent; border: 1px solid rgba(255,255,255,.16);
          color: #cbd5e1; border-radius: 10px; padding: 9px; cursor: pointer; font-size: 12px;
        }
        .nf-condition-summary .nf-summary-fine { font-size: 10px; color: rgba(148,163,184,.8); margin: 12px 0 0; text-align: center; }

        @media (min-width: 768px) {
          .nf-condition-section { padding: 72px 0 80px; }
          .nf-condition-grid { grid-template-columns: 1.4fr 1fr; gap: 24px; align-items: start; }
          .nf-condition-main, .nf-condition-summary { padding: 24px; }
          .nf-condition-options { grid-template-columns: 1fr 1fr; }
          .nf-condition-level { font-size: 52px; }
        }
        @media (min-width: 1024px) {
          .nf-condition-label { font-size: 13.5px; }
          .nf-condition-detail { font-size: 11.5px; }
          .nf-condition-note, .nf-condition-line, .nf-summary-empty { font-size: 13.5px; }
        }
        @media (min-width: 1280px) {
          .nf-condition-section { padding: 88px 0 96px; }
        }
      `}</style>
    </section>
  )
}

export default ConditionCheck
