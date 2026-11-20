import { db } from './firebase'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'

// Üks staatuse loend kogu lehele: tracker ja admin kasutavad sama järjekorda.
export const STAGES = [
  { key: 'received', title: 'Päring vastu võetud', text: 'Sinu remondipäring on meil olemas.' },
  { key: 'diagnosis', title: 'Tasuta diagnostika', text: 'Seadme ülevaatus ja täpse hinna kinnitus.' },
  { key: 'approved', title: 'Hind kinnitatud', text: 'Ootame sinu nõusolekut töö alustamiseks.' },
  { key: 'repair', title: 'Remont käib', text: 'Tehnik teeb töö ja kontrollib tulemust.' },
  { key: 'ready', title: 'Valmis üleandmiseks', text: 'Seade on kättesaadav, garantii algab.' },
]

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function makeCode() {
  const bytes = new Uint8Array(6)
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256)
  }
  let tail = ''
  for (let i = 0; i < bytes.length; i += 1) tail += ALPHABET[bytes[i] % ALPHABET.length]
  return `NF-${new Date().getFullYear()}-${tail}`
}

export async function createRepair(data) {
  if (!db) throw new Error('Andmebaas pole saadaval')
  const code = makeCode()
  const ref = await addDoc(collection(db, 'repairs'), {
    code,
    name: String(data.name || '').slice(0, 80),
    phone: String(data.phone || '').slice(0, 40),
    email: String(data.email || '').slice(0, 120),
    service: String(data.service || '').slice(0, 120),
    device: String(data.device || '').slice(0, 120),
    message: String(data.message || '').slice(0, 600),
    status: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return { code, id: ref.id }
}

export async function getRepair(code) {
  if (!db) return null
  const q = query(collection(db, 'repairs'), where('code', '==', code.toUpperCase()), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export function watchRepair(code, onValue, onError) {
  if (!db) {
    onError?.(new Error('Andmebaas pole saadaval'))
    return () => {}
  }
  const q = query(collection(db, 'repairs'), where('code', '==', code.toUpperCase()), limit(1))
  return onSnapshot(q, (snap) => {
    if (snap.empty) { onValue(null); return }
    const d = snap.docs[0]
    onValue({ id: d.id, ...d.data() })
  }, onError)
}

export async function setRepairStatus(id, status) {
  if (!db) throw new Error('Andmebaas pole saadaval')
  if (!Number.isInteger(status) || status < 0 || status >= STAGES.length) {
    throw new Error('Vigane staatus')
  }
  await updateDoc(doc(db, 'repairs', id), { status, updatedAt: serverTimestamp() })
}

// Diagnoosi märkused ja kinnitatud hind lähevad kliendile tema koodiga
// jälgimisvaates kuvamiseks. Mõlemad on vabatekst, et mahutaksid ka
// täpsustused (nt "aku 55 € + ekraan 89 € = 144 €").
export async function updateRepairInfo(id, { diagnosis, price }) {
  if (!db) throw new Error('Andmebaas pole saadaval')
  await updateDoc(doc(db, 'repairs', id), {
    diagnosis: String(diagnosis || '').slice(0, 1000),
    price: String(price || '').slice(0, 200),
    updatedAt: serverTimestamp(),
  })
}

// Diagnostikatarkvarade (HWiNFO, CrystalDiskInfo, 3uTools jt) tekstilised
// aruanded salvestatakse otse dokumendi sisse. Firestore'i 1 MB piirang
// mahutab need probleemideta; Storage nõuaks Blaze'i ja makseinfo.
export async function updateRepairReport(id, { name, text, url }) {
  if (!db) throw new Error('Andmebaas pole saadaval')
  const cleanUrl = String(url || '').trim()
  const safeUrl = /^https?:\/\//i.test(cleanUrl) ? cleanUrl : ''
  await updateDoc(doc(db, 'repairs', id), {
    reportName: String(name || '').slice(0, 120),
    reportText: String(text || '').slice(0, 500000),
    reportUrl: safeUrl,
    updatedAt: serverTimestamp(),
  })
}
