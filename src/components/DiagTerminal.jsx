import { useEffect, useRef, useState } from 'react'

// Interaktiivne näidisdiagnostika. Tulemused on näitlikud (demo), mitte
// päris seadme mõõtmised — lõpliku hinnangu annab NutiFix pärast päris
// diagnostikat. Hinnad, mida tekstis mainitakse, tulevad avalikust
// hinnakirjast (SmartQuote OPTIONS), et leht räägiks ühte keelt.

const DEVICES = [
  {
    key: 'phone',
    label: 'Telefon',
    icon: '📱',
    tools: ['3uTools', 'AccuBattery', 'Androidi/iOS-i diagnostika'],
    checks: [
      { name: 'Ekraanipaneel', value: '3uTools: puudub kuvaviga', state: 'ok' },
      { name: 'Puutetundlikkus', value: '9/10 tsoonil', state: 'warn', note: 'üks nurk reageerib nõrgemalt' },
      { name: 'Aku tervis', value: '78% mahutavusest', state: 'warn', note: 'AccuBattery / iOS-i akuaruanne' },
      { name: 'Laadimisport', value: 'kontakt puhas', state: 'ok' },
      { name: 'Kõlar ja mikrofon', value: 'mõlemad töötavad', state: 'ok' },
      { name: 'Tarkvara', value: 'uuendused saadaval', state: 'warn' },
      { name: 'Varundus', value: 'pilvevarundus olemas', state: 'ok' },
    ],
    verdict: {
      state: 'warn',
      title: 'Kaks nõrgimat kohta: aku ja puutetundlikkus',
      text: 'Aku mahutavus on langenud ja üks ekraani nurk reageerib nõrgemalt. Aku vahetus on hinnakirjas 55 €, ekraani vahetus alates 89 € — tasub alustada tasuta diagnostikast, et näha, kas piisab akust.',
    },
  },
  {
    key: 'laptop',
    label: 'Sülearvuti',
    icon: '💻',
    tools: ['UserDiag', 'CrystalDiskInfo', 'HWiNFO', 'MemTest86', 'Defender'],
    checks: [
      { name: 'UserDiag koormustest', value: '91 °C, taktimine langeb', state: 'fail', note: 'jahutus vajab puhastust' },
      { name: 'SSD tervis', value: 'CrystalDiskInfo: 92%', state: 'ok' },
      { name: 'Kettaruum', value: '14% vaba', state: 'warn', note: 'alla 15% aeglustab süsteemi' },
      { name: 'Mälu', value: 'MemTest86: veatu', state: 'ok' },
      { name: 'Ventilaator', value: 'HWiNFO: undamine', state: 'warn' },
      { name: 'Käivitumisaeg', value: '48 s', state: 'warn' },
      { name: 'Sündmuste logi', value: '12 viga / 7 päeva', state: 'warn', note: 'Windowsi sündmuste vaatur' },
    ],
    verdict: {
      state: 'fail',
      title: 'Jahutus on ummistunud — kõige kiirem võit',
      text: 'UserDiagi koormustest näitab 91 °C ja taktimise langust, CrystalDiskInfo järgi on kettad korras. Hoolduspakett (60 €) katab puhastuse ja termopasta; kui lisada SSD kontroll, saab käivitumisajast maha ka mitu sekundit.',
    },
  },
  {
    key: 'desktop',
    label: 'Arvuti',
    icon: '🖥️',
    tools: ['UserDiag', 'CrystalDiskInfo', 'HWiNFO', 'MemTest86', 'Defender'],
    checks: [
      { name: 'UserDiag koormustest', value: '74 °C, stabiilne', state: 'ok' },
      { name: 'Kettad', value: 'CrystalDiskInfo: 1 hoiatus', state: 'warn', note: 'üks ketas näitab kulumist' },
      { name: 'Mälu', value: 'MemTest86: 8 GB veatu', state: 'ok' },
      { name: 'Toiteplokk', value: 'HWiNFO: pinged stabiilsed', state: 'ok' },
      { name: 'Ventilaatorid', value: '3/3 töökorras', state: 'ok' },
      { name: 'Operatsioonisüsteem', value: 'aktiveerimata', state: 'warn' },
      { name: 'Viirusekontroll', value: 'Defender: puhas', state: 'ok' },
    ],
    verdict: {
      state: 'warn',
      title: 'Kõige mõistlikum samm: ketas ja värske süsteem',
      text: 'Üks ketas näitab CrystalDiskInfo järgi kulumist ja Windows on aktiveerimata. HDD → SSD uuendus on hinnakirjas 40 € + ketas, Windowsi puhas paigaldus 50 €. Andmed saab enne üle tõsta.',
    },
  },
]

const STATE_STYLE = {
  ok: { icon: '✓', className: 'nf-diag-ok', label: 'korras' },
  warn: { icon: '!', className: 'nf-diag-warn', label: 'tähelepanu' },
  fail: { icon: '✕', className: 'nf-diag-fail', label: 'probleem' },
}

function DiagTerminal() {
  const [deviceKey, setDeviceKey] = useState(DEVICES[0].key)
  const [revealed, setRevealed] = useState(0)
  const [running, setRunning] = useState(false)
  const timer = useRef(null)

  const device = DEVICES.find((d) => d.key === deviceKey) || DEVICES[0]
  const total = device.checks.length
  const finished = revealed >= total
  const progress = Math.round((revealed / total) * 100)

  useEffect(() => () => clearInterval(timer.current), [])

  const run = () => {
    clearInterval(timer.current)
    setRunning(true)
    setRevealed(0)
    let i = 0
    timer.current = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= total) {
        clearInterval(timer.current)
        setRunning(false)
      }
    }, 240)
  }

  const pick = (key) => {
    clearInterval(timer.current)
    setRunning(false)
    setRevealed(0)
    setDeviceKey(key)
  }

  return (
    <section id="diag" className="relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-3 md:mb-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
            Näidisdiagnostika
          </h2>
          <p className="mt-2 text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
            Vali seade ja käivita näidisskaneerimine. Päris töökojas käime seadme läbi UserDiagni ja erinevate diagnostikatarkvaradega — see vaade näitab, mida me kontrollime.
          </p>
        </div>

        <div className="nf-diag-steps" aria-label="Diagnostika sammud">
          <div><b>1</b><span>Vali seade</span></div>
          <div><b>2</b><span>Käivita skaneerimine</span></div>
          <div><b>3</b><span>Saad hinnangu enne tööd</span></div>
        </div>

        <div className="nf-term">
          <div className="nf-term-bar">
            <span className="nf-dot nf-dot-r" />
            <span className="nf-dot nf-dot-y" />
            <span className="nf-dot nf-dot-g" />
            <span className="nf-term-title">nutifix ~ diagnostika</span>
            <span className="nf-term-badge">näidisandmed</span>
          </div>

          <div className="nf-term-body">
            <div className="nf-diag-chips" role="group" aria-label="Vali seade">
              {DEVICES.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => pick(d.key)}
                  aria-pressed={d.key === deviceKey}
                  className={`nf-chip ${d.key === deviceKey ? 'nf-chip-on' : ''}`}
                >
                  <span aria-hidden="true">{d.icon}</span> {d.label}
                </button>
              ))}
            </div>

            <div className="nf-diag-head">
              <span className="nf-diag-prompt">$ nutifix scan --seade {device.key}</span>
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="nf-diag-run"
              >
                {running ? 'Skaneerin…' : finished ? 'Skaneeri uuesti' : 'Käivita diagnostika'}
              </button>
            </div>

            <div className="nf-progress" aria-hidden="true">
              <i style={{ width: `${progress}%` }} />
            </div>

            <ul className="nf-diag-list" aria-live="polite">
              {device.checks.slice(0, revealed).map((check, index) => {
                const style = STATE_STYLE[check.state]
                return (
                  <li key={check.name} className="nf-diag-row" style={{ animationDelay: `${index * 40}ms` }}>
                    <span className={`nf-diag-mark ${style.className}`} aria-hidden="true">{style.icon}</span>
                    <span className="nf-diag-name">{check.name}</span>
                    <span className="nf-diag-value">{check.value}</span>
                    <span className={`nf-diag-tag ${style.className}`}>{style.label}</span>
                  </li>
                )
              })}
              {revealed === 0 && !running && (
                <li className="nf-diag-empty">
                  Vajuta „Käivita diagnostika” — read jooksevad siia ükshaaval.
                </li>
              )}
            </ul>

            {finished && (
              <div className={`nf-diag-verdict ${STATE_STYLE[device.verdict.state].className}`}>
                <strong>{device.verdict.title}</strong>
                <p>{device.verdict.text}</p>
                <a href="#contact" className="nf-diag-cta">Broneeri tasuta diagnostika →</a>
              </div>
            )}
          </div>

          <div className="nf-tools">
            <span className="nf-tools-label">Tööriistad selles vaates:</span>
            {device.tools.map((tool) => (
              <span key={tool} className="nf-tools-chip">{tool}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default DiagTerminal
