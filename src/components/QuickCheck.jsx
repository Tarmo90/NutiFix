import { useEffect, useRef, useState } from 'react'

// Päris brauseris jooksev kiirkontroll. Erinevalt näidisdiagnostikast
// mõõdetakse siin seda, mida brauser lubab; ülejäänud jäävad käsitsi
// hinnanguks. Tulemuse saab kopeerida ja MxMobiga täiendada.

const COLORS = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff']
const GRID = Array.from({ length: 9 }, (_, i) => i)
const STATUS = {
  ok: { label: 'korras', className: 'nf-qc-ok' },
  fail: { label: 'viga', className: 'nf-qc-fail' },
  manual: { label: 'käsitsi', className: 'nf-qc-manual' },
  info: { label: 'andmed', className: 'nf-qc-info' },
}

function QuickCheck() {
  const [results, setResults] = useState({})
  const [colorIndex, setColorIndex] = useState(0)
  const [colorOpen, setColorOpen] = useState(false)
  const [tapped, setTapped] = useState([])
  const [micState, setMicState] = useState('')
  const [micLevel, setMicLevel] = useState(0)
  const [copied, setCopied] = useState(false)
  const [cameraState, setCameraState] = useState('')
  const [sensorState, setSensorState] = useState('')
  const micRef = useRef(null)
  const cameraRef = useRef(null)
  const sensorRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => () => {
    micRef.current?.stream?.getTracks().forEach((track) => track.stop())
    micRef.current?.context?.close()
    cameraRef.current?.getTracks().forEach((track) => track.stop())
    if (sensorRef.current) {
      window.removeEventListener('devicemotion', sensorRef.current.handler)
      clearTimeout(sensorRef.current.timer)
    }
  }, [])

  const setResult = (id, status, detail) => {
    setResults((prev) => ({ ...prev, [id]: { status, detail } }))
  }

  const markTapped = (index) => {
    setTapped((prev) => {
      const next = prev.includes(index) ? prev : [...prev, index]
      if (next.length === GRID.length) {
        setResult('touch', 'ok', `${GRID.length}/${GRID.length} tsooni reageeris`)
      }
      return next
    })
  }

  const playTone = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) { setResult('speaker', 'manual', 'brauser ei toeta heli'); return }
    const context = new AudioCtx()
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = 'sine'
    osc.frequency.value = 660
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(context.destination)
    osc.start()
    osc.stop(context.currentTime + 0.8)
    osc.onended = () => context.close()
    setResult('speaker', 'manual', 'helisignaal 660 Hz / 0,8 s — kas kuulsid?')
  }

  const startMic = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('pole saadaval')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      const context = new AudioCtx()
      const source = context.createMediaStreamSource(stream)
      const analyser = context.createAnalyser()
      analyser.fftSize = 512
      source.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const stop = () => {
        stream.getTracks().forEach((track) => track.stop())
        context.close()
        micRef.current = null
        setMicState('')
        setMicLevel(0)
      }
      micRef.current = { stream, context, stop }
      setMicState('active')
      const tick = () => {
        if (!micRef.current) return
        analyser.getByteTimeDomainData(data)
        let peak = 0
        for (const value of data) peak = Math.max(peak, Math.abs(value - 128))
        setMicLevel(Math.min(100, Math.round((peak / 128) * 100)))
        requestAnimationFrame(tick)
      }
      tick()
    } catch {
      setResult('mic', 'manual', 'mikrofonipääs puudub — kontrolli käsitsi')
    }
  }

  const readBattery = async () => {
    try {
      if (!navigator.getBattery) { setResult('battery', 'manual', 'brauser ei näita aku andmeid'); return }
      const battery = await navigator.getBattery()
      const detail = `${Math.round(battery.level * 100)} %${battery.charging ? ', laeb' : ''}`
      setResult('battery', 'info', detail)
    } catch {
      setResult('battery', 'manual', 'aku andmed pole saadaval')
    }
  }

  const readDevice = () => {
    const platform = navigator.userAgentData?.platform || navigator.platform || 'teadmata'
    const screenSize = `${window.screen.width}×${window.screen.height}`
    const network = navigator.connection?.effectiveType ? ` · ${navigator.connection.effectiveType}` : ''
    setResult('device', 'info', `${platform} · ${screenSize} · ${navigator.onLine ? 'võrgus' : 'võrgust väljas'}${network}`)
  }

  const toggleCamera = async () => {
    if (cameraRef.current) {
      cameraRef.current.getTracks().forEach((track) => track.stop())
      cameraRef.current = null
      setCameraState('')
      return
    }
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('pole saadaval')
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      cameraRef.current = stream
      setCameraState('active')
      setResult('camera', 'manual', 'kaader avatud — kas pilt on terav?')
      setTimeout(() => {
        if (cameraRef.current === stream && videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      }, 0)
    } catch {
      setResult('camera', 'manual', 'kaamera pääs puudub')
    }
  }

  const toggleSensors = async () => {
    if (sensorRef.current) {
      window.removeEventListener('devicemotion', sensorRef.current.handler)
      clearTimeout(sensorRef.current.timer)
      sensorRef.current = null
      setSensorState('')
      return
    }
    try {
      if (!window.DeviceMotionEvent) throw new Error('pole saadaval')
      if (window.DeviceMotionEvent.requestPermission) {
        const permission = await window.DeviceMotionEvent.requestPermission()
        if (permission !== 'granted') throw new Error('keelatud')
      }
      const handler = (event) => {
        const acceleration = event.accelerationIncludingGravity || event.acceleration
        if (!acceleration) return
        const magnitude = Math.abs(acceleration.x || 0) + Math.abs(acceleration.y || 0) + Math.abs(acceleration.z || 0)
        if (magnitude <= 1) return
        setResult('sensors', 'ok', 'kiirendusmõõtur reageerib liikumisele')
        window.removeEventListener('devicemotion', handler)
        clearTimeout(sensorRef.current?.timer)
        sensorRef.current = null
        setSensorState('')
      }
      const timer = setTimeout(() => {
        window.removeEventListener('devicemotion', handler)
        if (sensorRef.current?.timer === timer) sensorRef.current = null
        setSensorState('')
        setResult('sensors', 'manual', 'anduri liikumist ei tuvastatud')
      }, 5000)
      sensorRef.current = { handler, timer }
      window.addEventListener('devicemotion', handler)
      setSensorState('active')
      setResult('sensors', 'manual', 'liiguta seadet — ootan andurit')
    } catch {
      setResult('sensors', 'manual', 'brauser ei luba andureid')
    }
  }

  const testVibration = () => {
    if (!navigator.vibrate) { setResult('vibration', 'manual', 'brauser ei toeta vibratsiooni'); return }
    navigator.vibrate(300)
    setResult('vibration', 'manual', '300 ms vibratsioon — kas tundsid?')
  }

  const readStorage = async () => {
    try {
      if (!navigator.storage?.estimate) { setResult('storage', 'manual', 'andmed pole saadaval'); return }
      const { usage = 0, quota = 0 } = await navigator.storage.estimate()
      setResult('storage', 'info', `${(usage / 1e9).toFixed(1)} / ${(quota / 1e9).toFixed(1)} GB kasutusel`)
    } catch {
      setResult('storage', 'manual', 'andmed pole saadaval')
    }
  }

  const rows = [
    { id: 'screen', label: 'Ekraan', action: 'Näita värve', run: () => { setColorIndex(0); setColorOpen(true) } },
    { id: 'touch', label: 'Puudetus', action: 'Puuduta ruudud', run: () => {} },
    { id: 'speaker', label: 'Kõlar', action: 'Mängi heli', run: playTone },
    { id: 'mic', label: 'Mikrofon', action: micState === 'active' ? 'Peata' : 'Kontrolli', run: () => {
      if (micState === 'active') { micRef.current?.stop(); setResult('mic', 'manual', 'käsitsi hinnatud') }
      else startMic()
    } },
    { id: 'battery', label: 'Aku', action: 'Loe andmed', run: readBattery },
    { id: 'device', label: 'Seade', action: 'Loe andmed', run: readDevice },
    { id: 'camera', label: 'Kaamera', action: cameraState === 'active' ? 'Peata kaader' : 'Ava kaader', run: toggleCamera },
    { id: 'sensors', label: 'Andurid', action: sensorState === 'active' ? 'Peata' : 'Liiguta seadet', run: toggleSensors },
    { id: 'vibration', label: 'Vibratsioon', action: 'Proovi 300 ms', run: testVibration },
    { id: 'storage', label: 'Mälumaht', action: 'Loe andmed', run: readStorage },
  ]

  const finished = Object.values(results).filter((r) => r.status !== 'info')
  const okCount = finished.filter((r) => r.status === 'ok').length
  const failCount = finished.filter((r) => r.status === 'fail').length
  const summaryText = Object.keys(results).length
    ? [
        `NutiFix kiirkontroll (${new Date().toLocaleDateString('et-EE')})`,
        ...rows.filter((row) => results[row.id]).map((row) =>
          `${row.label}: ${results[row.id].detail || STATUS[results[row.id].status].label}`
        ),
        `Kokkuvõte: ${okCount} korras, ${failCount} viga. Põhjalikum 33-punkti test: mxmob.com/check`,
      ].join('\n')
    : ''

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="kiirkontroll" className="nf-qc-section">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="nf-eyebrow">KIIRKONTROLL</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Kontrolli seadet ise — 2 minutit
          </h2>
          <p className="text-blue-200 text-sm sm:text-base max-w-2xl mx-auto">
            Need testid jooksevad sinu brauseris ja ei saada andmeid kuhugi. Tulemuse saad kopeerida ja meile saata —
            täpse hinnangu anname tasuta diagnostikal.
          </p>
        </div>

        <div className="nf-qc-grid">
          {rows.map((row) => {
            const result = results[row.id]
            return (
              <div key={row.id} className="nf-qc-card">
                <div className="nf-qc-head">
                  <b>{row.label}</b>
                  {result && <span className={`nf-qc-badge ${STATUS[result.status].className}`}>{STATUS[result.status].label}</span>}
                </div>
                <p className="nf-qc-detail">{result?.detail || 'Veel kontrollimata'}</p>
                <button type="button" onClick={row.run} className="nf-qc-btn">{row.action}</button>
                {row.id === 'camera' && cameraState === 'active' && (
                  <video ref={videoRef} autoPlay playsInline muted className="nf-qc-video" />
                )}
                {['touch', 'speaker', 'screen', 'camera', 'sensors', 'vibration'].includes(row.id) && result && (
                  <div className="nf-qc-marks">
                    <button type="button" onClick={() => setResult(row.id, 'ok', 'kontrollitud — korras')}>Korras</button>
                    <button type="button" onClick={() => setResult(row.id, 'fail', 'kontrollitud — viga')}>Viga</button>
                  </div>
                )}
                {row.id === 'mic' && micState === 'active' && (
                  <div className="nf-qc-meter" aria-hidden="true"><i style={{ width: `${micLevel}%` }} /></div>
                )}
              </div>
            )
          })}
        </div>

        <div className="nf-qc-touch" aria-label="Puutetest">
          <div className="nf-qc-touch-title">Puutetest — vajuta kõik 9 ruutu</div>
          <div className="nf-qc-touch-grid">
            {GRID.map((index) => (
              <button
                key={index}
                type="button"
                aria-label={`Tsoon ${index + 1}`}
                onClick={() => markTapped(index)}
                className={tapped.includes(index) ? 'tapped' : ''}
              />
            ))}
          </div>
          <div className="nf-qc-touch-count">{tapped.length}/9 tsooni</div>
        </div>

        {summaryText && (
          <div className="nf-qc-summary">
            <div className="nf-qc-summary-head">
              <b>Sinu kokkuvõte</b>
              <button type="button" onClick={copySummary}>{copied ? 'Kopeeritud ✓' : 'Kopeeri tekst'}</button>
            </div>
            <textarea readOnly rows="8" value={summaryText} />
            <a href="#contact" onClick={() => { void copySummary() }}>Saada meile oma tulemus →</a>
          </div>
        )}

        <div className="nf-qc-foot">
          Põhjalikum test: <a href="https://mxmob.com/check" target="_blank" rel="noopener noreferrer">Ava MxMobi 33-punkti test ↗</a>
        </div>

        <style>{`
          .nf-qc-section { padding: 24px 0 64px; }
          .nf-qc-section .nf-eyebrow {
            display: inline-block; color: #38bdf8; border: 1px solid rgba(56,189,248,.35);
            border-radius: 999px; padding: 3px 12px; font-size: 11px; font-weight: 800;
            letter-spacing: .12em; margin-bottom: 12px;
          }
          .nf-qc-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
          .nf-qc-card {
            background: rgba(30,41,59,.75); border: 1px solid rgba(255,255,255,.12);
            border-radius: 14px; padding: 14px;
          }
          .nf-qc-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
          .nf-qc-head b { color: #fff; font-size: 14px; }
          .nf-qc-badge { font-size: 11px; font-weight: 700; border-radius: 999px; padding: 2px 8px; }
          .nf-qc-ok { color: #86efac; background: rgba(34,197,94,.16); }
          .nf-qc-fail { color: #fca5a5; background: rgba(239,68,68,.16); }
          .nf-qc-manual { color: #fcd34d; background: rgba(245,158,11,.16); }
          .nf-qc-info { color: #c4b5fd; background: rgba(139,92,246,.16); }
          .nf-qc-detail { font-size: 12px; color: rgba(219,234,254,.7); margin: 8px 0 10px; min-height: 16px; word-break: break-word; }
          .nf-qc-btn, .nf-qc-marks button, .nf-qc-summary-head button {
            background: #2563eb; color: #fff; border: none; border-radius: 8px;
            padding: 8px 12px; font-size: 12px; font-weight: 700; cursor: pointer;
          }
          .nf-qc-btn:disabled { opacity: .5; cursor: default; }
          .nf-qc-marks { display: flex; gap: 8px; margin-top: 8px; }
          .nf-qc-marks button { background: #334155; }
          .nf-qc-meter { height: 6px; background: rgba(255,255,255,.12); border-radius: 999px; margin-top: 10px; overflow: hidden; }
          .nf-qc-meter i { display: block; height: 100%; background: #38bdf8; }
          .nf-qc-video { width: 100%; max-height: 180px; border-radius: 10px; margin-top: 10px; background: #000; object-fit: cover; }
          .nf-qc-touch {
            margin-top: 16px; background: rgba(15,23,42,.7); border: 1px solid rgba(255,255,255,.1);
            border-radius: 14px; padding: 14px;
          }
          .nf-qc-touch-title { font-size: 13px; color: #bfdbfe; font-weight: 700; margin-bottom: 10px; }
          .nf-qc-touch-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; max-width: 330px; }
          .nf-qc-touch-grid button {
            aspect-ratio: 1; border-radius: 10px; border: 1px solid rgba(148,163,184,.5);
            background: rgba(51,65,85,.6); cursor: pointer;
          }
          .nf-qc-touch-grid button.tapped { background: #2563eb; border-color: #60a5fa; }
          .nf-qc-touch-count { font-size: 12px; color: #93c5fd; margin-top: 10px; }
          .nf-qc-summary {
            margin-top: 16px; background: rgba(30,41,59,.8); border: 1px solid rgba(139,92,246,.35);
            border-radius: 14px; padding: 14px;
          }
          .nf-qc-summary-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 10px; }
          .nf-qc-summary-head b { color: #ddd6fe; font-size: 14px; }
          .nf-qc-summary textarea {
            width: 100%; background: #0f172a; color: #e2e8f0; border: 1px solid rgba(255,255,255,.15);
            border-radius: 10px; padding: 10px; font-family: inherit; font-size: 12px; resize: vertical;
          }
          .nf-qc-summary a { display: inline-block; margin-top: 10px; color: #93c5fd; font-size: 13px; }
          .nf-qc-foot { margin-top: 16px; font-size: 12px; color: rgba(219,234,254,.65); }
          .nf-qc-foot a { color: #93c5fd; }
          @media (min-width: 768px) {
            .nf-qc-section { padding: 32px 0 80px; }
            .nf-qc-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; }
          }
        `}</style>
        {colorOpen && (
          <div
            className="fixed inset-0 z-[120] flex flex-col justify-end"
            style={{ background: COLORS[colorIndex] }}
            onClick={() => setColorIndex((i) => (i + 1) % COLORS.length)}
            role="presentation"
          >
            <div className="p-4 flex flex-wrap gap-3 justify-center bg-slate-950/70" onClick={(e) => e.stopPropagation()}>
              <span className="text-white text-sm self-center">Kas värvid on ühtlased? Puuduta ekraani, et vahetada.</span>
              <button type="button" onClick={() => { setResult('screen', 'ok', 'värvid ja piksliapid kontrollitud'); setColorOpen(false) }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Korras</button>
              <button type="button" onClick={() => { setResult('screen', 'fail', 'ekraanil märgati värvi- või piksliviga'); setColorOpen(false) }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Viga</button>
              <button type="button" onClick={() => setColorOpen(false)}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Sulge</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default QuickCheck
