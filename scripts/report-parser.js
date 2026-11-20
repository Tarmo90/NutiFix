const cheerio = require('cheerio')

const MONTHS = {
  January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
  July: '07', August: '08', September: '09', October: '10', November: '11', December: '12',
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
  'S Pen & Stylus': 'S Pen / pliiats',
  'Fingerprint / Face': 'Sõrmejälg / näotuvastus',
  'Device info': 'Seadme info',
  'Widevine DRM': 'Widevine DRM',
  'Cosmetic inspection': 'Välimuse kontroll',
}

const STATUS = {
  Failed: 'läbimata',
  Skipped: 'vahele jäetud',
  'Not tested': 'testimata',
}

function formatDate(text) {
  const match = String(text || '').match(/([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})/)
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
  if (/wi-fi:/i.test(lower)) {
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

function parseReport(html, url) {
  const $ = cheerio.load(String(html || ''))
  const device = $('h1').first().text().trim()
  const meta = $('meta[name="description"]').attr('content') || ''
  const header = $('header p').last().text().trim()

  const specs = {}
  $('dl').first().find('div').each((_, node) => {
    const key = $(node).find('dt').first().text().trim()
    const val = $(node).find('dd').first().text().trim()
    if (key) specs[key] = val
  })

  const score = (meta.match(/(\d+)\/(\d+)/) || [])[0] || ''
  const counts = meta.match(/(\d+)\s+passed,\s*(\d+)\s+failed,\s*(\d+)\s+skipped/)
  const grade = (meta.match(/Grade\s+([A-F][+-]?)/) || html.match(/Grade\s+([A-F][+-]?)/) || [])[1] || ''
  const created = formatDate((header.match(/Created\s+([A-Za-z]+ \d+, \d{4})/) || [])[1])
  const expiry = formatDate((header.match(/expires\s+([A-Za-z]+ \d+, \d{4})/) || [])[1])

  const tests = []
  $('h3').each((_, heading) => {
    const list = $(heading).next('ul')
    if (!list.length) return
    list.find('li').each((__, item) => {
      const name = $(item).find('div.text-sm.font-semibold').first().text().trim()
      const detail = $(item).find('div.text-xs.text-ink-muted').first().text().trim()
      const badges = $(item).find('span').map((___, span) => $(span).text().trim()).get().filter(Boolean)
      const status = badges.find((b) => ['Passed', 'Failed', 'Skipped', 'Not tested'].includes(b)) || ''
      if (!name || !status) return
      tests.push({ name, detail, status })
    })
  })

  if (!device || tests.length < 5) return null

  const lines = []
  lines.push(`Seade: ${device}${specs.Software ? `, ${specs.Software}` : ''}.`)
  if (score || counts) {
    const [passed = '0', failed = '0', skipped = '0'] = counts ? counts.slice(1) : []
    lines.push(
      `MxMobi test${created ? ` (${created})` : ''}: ${score || '—'}${grade ? `, Grade ${grade}` : ''}. ` +
      `${passed} läbinud, ${failed} läbimata, ${skipped} vahele jäetud.`
    )
  }

  const measured = tests
    .filter((t) => t.detail && t.status === 'Passed' && LABELS[t.name])
    .slice(0, 14)
    .map((t) => `${LABELS[t.name]}: ${translateDetail(t.name, t.detail)}`)
  if (measured.length) lines.push(`Mõõdetud: ${measured.join('; ')}.`)

  const issues = tests
    .filter((t) => STATUS[t.status])
    .map((t) => `${LABELS[t.name] || t.name} ${STATUS[t.status]}`)
  if (issues.length) lines.push(`Tähelepanu: ${issues.join('; ')}.`)

  const failed = counts ? Number(counts[2]) : tests.filter((t) => t.status === 'Failed').length
  lines.push(
    failed > 0
      ? `Kokkuvõte: leitud ${failed} läbimata testi — vaja täpsemat ülevaatust.`
      : 'Kokkuvõte: kriitilisi vigu ei leitud.'
  )
  if (expiry) lines.push(`MxMobi link aegub ${expiry}; põhitulemused on talletatud siin.`)
  else lines.push('MxMobi link on ajutine; põhitulemused on talletatud siin.')

  return lines.join('\n').slice(0, 1800)
}

module.exports = { parseReport }
