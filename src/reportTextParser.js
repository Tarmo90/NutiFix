// Jagatud tekstiparser: tööb nii brauseris (Haldusekleebis) kui ka Node'is.
(function (root, factory) {
  const api = factory()
  if (typeof module !== 'undefined' && module.exports) module.exports = api
  else root.NutiFixReportText = api
})(typeof window !== 'undefined' ? window : this, function () {
  const MONTHS = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  }

  const LABELS = {
    'Screen colors': 'Ekraani värvid',
    'Touch screen': 'Puudetus',
    'Multi-touch': 'Mitmepuute',
    Speakers: 'Kõlarid',
    Earpiece: 'Kõrvaklapp',
    Microphone: 'Mikrofon',
    'Wired headphones': 'Juhtmega kõrvaklapid',
    'Rear camera': 'Tagakaamera',
    'Front camera': 'Esikaamera',
    Flashlight: 'Taskulamp',
    Accelerometer: 'Kiirendusmõõtur',
    Gyroscope: 'Güroskoop',
    Compass: 'Kompass',
    'Proximity sensor': 'Lähedussensor',
    'Light sensor': 'Valgussensor',
    'Wi-Fi': 'Wi-Fi',
    'Mobile data': 'Mobiiliandmed',
    'SIM / eSIM': 'SIM / eSIM',
    GPS: 'GPS',
    Bluetooth: 'Bluetooth',
    NFC: 'NFC',
    Battery: 'Aku',
    'Charging port': 'Laadimisport',
    'Wireless charging': 'Juhtmevaba laadimine',
    Vibration: 'Vibratsioon',
    'Volume buttons': 'Helinupud',
    'Power button': 'Toitenupp',
    'Processor & graphics': 'Protsessor ja graafika',
    'Fingerprint / Face': 'Sõrmejälg / näotuvastus',
    'Device info': 'Seadme info',
    'Widevine DRM': 'Widevine DRM',
    'Cosmetic inspection': 'Välimuse kontroll',
  }

  function formatDate(text) {
    const match = String(text || '').match(/\b([A-Z][a-z]{2})\s+(\d{1,2}),\s*(\d{4})/)
    if (!match || !MONTHS[match[1]]) return ''
    return `${match[2].padStart(2, '0')}.${MONTHS[match[1]]}.${match[3]}`
  }

  function translateDetail(name, detail) {
    const value = String(detail || '').trim()
    const lower = value.toLowerCase()

    if (/touch zones responded/.test(lower)) {
      const n = value.match(/\d+/)
      return n ? `${n[0]}/${n[0]} puutepunkti reageeris` : value
    }
    if (/simultaneous touch points detected/.test(lower)) {
      return `${(value.match(/\d+/) || ['0'])[0]} samaaegset puudet tuvastatud`
    }
    if (/voice picked up at/.test(lower)) {
      const db = value.match(/-?\d+\s*db/i)
      return db ? db[0].replace(/\s+/g, ' ') : value
    }
    if (/wi-fi:|mobile data:/i.test(lower)) {
      const nums = value.match(/\d+(?:\.\d+)?/g) || []
      return nums.length >= 2 ? `${nums[0].replace('.', ',')}/${nums[1].replace('.', ',')} Mbit/s` : value
    }
    if (/gps locked/.test(lower)) {
      const meters = value.match(/\((\d+)\s*m\)/i)
      return meters ? `±${meters[1]} m` : value
    }
    if (/battery reporting/.test(lower)) {
      const pct = value.match(/(\d+)\s*%/)
      return pct ? `${pct[1]} %${/charging/.test(lower) ? ', laeb' : ''}` : value
    }
    if (/cpu\s/.test(lower)) {
      const nums = value.match(/[\d,]+/g) || []
      const gpu = value.match(/\b(Mali-[A-Z0-9 ]+|Adreno \d+|Apple GPU)\b/i)
      return `${nums.slice(0, 2).map((n) => n.replace(/,/g, '')).join('/')}${gpu ? `, ${gpu[1]}` : ''}`
    }
    if (/widevine/i.test(lower)) {
      const level = value.match(/L[13]/)
      return level ? level[0] : value
    }
    if (/rotation detected/.test(lower)) {
      const deg = value.match(/(\d+)\s*°/)
      return deg ? `${deg[1]}°/s` : value
    }
    if (/heading tracked/.test(lower)) {
      const deg = value.match(/(\d+)\s*°/)
      return deg ? `${deg[1]}°` : value
    }
    if (/screen turned off and on/i.test(lower)) {
      const secs = value.match(/([\d.]+)\s*s/)
      return secs ? `${secs[1].replace('.', ',')} s` : value
    }
    if (/biometric verification succeeded/i.test(lower)) return 'korras'
    if (/no cosmetic damage found/i.test(lower)) return 'kahju ei leitud'
    if (/flashlight turned on/i.test(lower)) return 'töötab'
    if (/tilt detected/i.test(lower)) return 'reageerib'
    if (/found nearby device/i.test(lower)) return 'seade leitud'
    if (/vibration motor detected/i.test(lower)) return 'töötab'
    if (/working/i.test(lower)) {
      const res = value.match(/\d+×\d+/)
      return res ? `${name === 'Rear camera' ? 'tagakaamera' : 'esikaamera'} ${res[0]}` : value
    }
    return value.slice(0, 120)
  }

  function parseReportEmail(text) {
    const raw = String(text || '')
    const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

    const phone = (raw.match(/(?:^|\s)Phone:\s*([^\r\n]+?)(?=\s+Software:|\s+Result:|$)/im) || [])[1] || ''
    const software = (raw.match(/(?:^|\s)Software:\s*([^\r\n]+?)(?=\s+Result:|$)/im) || [])[1] || ''
    const result = (raw.match(/(?:^|\s)Result:\s*([^\r\n]+)/im) || [])[1] || ''
    const created = formatDate((raw.match(/MxMob Phone Diagnostic\s*·\s*([A-Z][a-z]{2} \d+, \d{4})/) || [])[1])
    const score = (result.match(/(\d+\/\d+)/) || [])[1] || ''
    const grade = (result.match(/Grade\s+([A-F][+-]?)/) || [])[1] || ''
    const counts = result.match(/(\d+)\s+passed\s*·\s*(\d+)\s+failed\s*·\s*(\d+)\s+skipped/)

    const tests = []
    for (const line of lines) {
      const match = line.match(/^(✅|❌|⚠|⏭️?)\s+(.+)$/u)
      if (!match) continue
      const marker = match[1]
      const body = match[2]
      const detailMatch = body.match(/^(.+?)\s*\((.+)\)$/)
      const name = (detailMatch ? detailMatch[1] : body).trim()
      const detail = detailMatch ? detailMatch[2].trim() : ''
      const status = marker === '✅' ? 'Passed' : marker === '❌' ? 'Failed' : 'Skipped'
      tests.push({ name, detail, status })
    }

    if (!phone || tests.length < 5) return null

    const linesOut = []
    linesOut.push(`Seade: ${phone}${software ? `, ${software}` : ''}.`)
    if (score || counts) {
      const [passed = '0', failed = '0', skipped = '0'] = counts ? counts.slice(1) : []
      linesOut.push(
        `MxMobi test${created ? ` (${created})` : ''}: ${score || '—'}${grade ? `, Grade ${grade}` : ''}. ` +
        `${passed} läbinud, ${failed} läbimata, ${skipped} vahelejäetud.`
      )
    }

    const measured = tests
      .filter((test) => test.detail && test.status === 'Passed' && LABELS[test.name] && test.name !== 'Device info')
      .slice(0, 14)
      .map((test) => `${LABELS[test.name]}: ${translateDetail(test.name, test.detail)}`)
    if (measured.length) linesOut.push(`Mõõdetud: ${measured.join('; ')}.`)

    const issues = tests
      .filter((test) => test.status !== 'Passed')
      .map((test) => `${LABELS[test.name] || test.name} ${test.status === 'Failed' ? 'läbimata' : 'vahele jäetud'}`)
    if (issues.length) linesOut.push(`Tähelepanu: ${issues.join('; ')}.`)

    const failed = counts ? Number(counts[2]) : tests.filter((test) => test.status === 'Failed').length
    const skipped = counts ? Number(counts[3]) : tests.filter((test) => test.status === 'Skipped').length
    linesOut.push(
      failed > 0
        ? `Kokkuvõte: leitud ${failed} läbimata testi — vaja täpsemat ülevaatust.`
        : 'Kokkuvõte: kriitilisi vigu ei leitud.'
    )
    if (skipped > 0) linesOut.push('Vahelejäetud testid kontrollitakse kohapeal.')

    return linesOut.join('\n').slice(0, 1800)
  }

  return { parseReportEmail }
})
