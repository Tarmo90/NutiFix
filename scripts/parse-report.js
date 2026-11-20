const admin = require('firebase-admin')
const { parseReport } = require('./report-parser')

const projectId = process.env.FIREBASE_PROJECT_ID || 'nutifix-new'
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT

if (!serviceAccountJson) {
  console.error('FIREBASE_SERVICE_ACCOUNT puudub — aruannet ei parsita.')
  process.exit(1)
}

let serviceAccount
try {
  serviceAccount = JSON.parse(serviceAccountJson)
} catch (err) {
  console.error('Firebase teenusekonto JSON on vigane:', err.message)
  process.exit(1)
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId })
const db = admin.firestore()

// Ainult avalikud HTTP(S) aadressid. Privaatvõrgud ja tied_hostid jäävad
// välja, et välislink ei saaks serverit sisemiste teenuste vastu suunata.
function publicUrl(raw) {
  let parsed
  try {
    parsed = new URL(String(raw || ''))
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
  if (parsed.username || parsed.password) return null
  const host = parsed.hostname.toLowerCase()
  if (host === 'localhost' || host === '::1' || host.endsWith('.localhost') || host.endsWith('.local')) return null
  if (/^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) return null
  return parsed
}

async function fetchReport(rawUrl) {
  let target = String(rawUrl)
  for (let hop = 0; hop < 4; hop += 1) {
    const url = publicUrl(target)
    if (!url) throw new Error('Link pole avalik HTTP(S) aadress')
    const res = await fetch(url.href, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'NutiFix-ReportParser/1.0', Accept: 'text/html' },
    })
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      const location = res.headers.get('location')
      if (!location) throw new Error('Jaotussuund puudub')
      target = new URL(location, url.href).href
      continue
    }
    if (!res.ok) throw new Error(`Aruande server vastas ${res.status}`)
    const declared = Number(res.headers.get('content-length') || 0)
    if (declared > 3000000) throw new Error('Aruanne on liiga suur')
    const contentType = res.headers.get('content-type') || ''
    if (contentType && !/html/i.test(contentType)) throw new Error('Aruanne pole HTML-leht')
    const html = await res.text()
    if (html.length > 3000000) throw new Error('Aruanne on liiga suur')
    return html
  }
  throw new Error('Liiga palju jaotussuundeid')
}

async function main() {
  const pending = await db.collection('repairs')
    .where('parseStatus', '==', 'pending')
    .limit(10)
    .get()

  if (pending.empty) {
    console.log('Ootavaid diagnostikaaruandeid pole.')
    return
  }

  for (const snapshot of pending.docs) {
    const data = snapshot.data()
    const label = data.code || snapshot.id
    try {
      if (!data.reportUrl) throw new Error('Aruande linki pole')
      const html = await fetchReport(data.reportUrl)
      const summary = parseReport(html, data.reportUrl)
      if (!summary) throw new Error('Aruande vormingut ei tuntud ära')
      await snapshot.ref.update({
        reportSummary: summary,
        parseStatus: 'done',
        parseError: '',
        parsedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
      console.log(`${label}: kokkuvõte valmis (${summary.length} märki).`)
    } catch (err) {
      const reason = String(err?.message || err).slice(0, 200)
      await snapshot.ref.update({
        reportSummary: '',
        parseStatus: 'error',
        parseError: reason,
        parsedAt: null,
      })
      console.warn(`${label}: ${reason}`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
