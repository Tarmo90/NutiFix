import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { STAGES, getRepair, setRepairStatus, updateRepairInfo, createRepair } from '../repairs'

function Admin() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [repair, setRepair] = useState(null)
  const [diagnosis, setDiagnosis] = useState('')
  const [price, setPrice] = useState('')
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newDevice, setNewDevice] = useState('')
  const [newService, setNewService] = useState('')
  const [newCode, setNewCode] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!auth) return undefined
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = async (e) => {
    e.preventDefault()
    if (!auth) { setMessage('Firebase pole saadaval.'); return }
    setBusy(true)
    setMessage('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      setPassword('')
    } catch (err) {
      setMessage('Sisselogimine ebaõnnestus: ' + (err?.message || 'tundmatu viga'))
    } finally {
      setBusy(false)
    }
  }

  const search = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    setRepair(null)
    try {
      const found = await getRepair(code.trim())
      setRepair(found)
      setDiagnosis(found?.diagnosis || '')
      setPrice(found?.price || '')
      if (!found) setMessage('Sellist koodi ei leitud.')
    } catch (err) {
      setMessage('Otsing ebaõnnestus: ' + (err?.message || 'tundmatu viga'))
    } finally {
      setBusy(false)
    }
  }

  // Kood loodud käsitsi (klient helistas või tuli kohale). Saadame kirja
  // samasse Formspree kanalisse — nii on kood ka sinu postkastis olemas.
  const createCode = async (e) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    setNewCode('')
    try {
      const created = await createRepair({
        name: newName,
        phone: newPhone,
        device: newDevice,
        service: newService,
        message: 'Kood loodud käsitsi Halduses',
      })
      setNewCode(created.code)
      try {
        await fetch('https://formspree.io/f/xgogrjql', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newName,
            phone: newPhone,
            device: newDevice,
            service: newService,
            message: 'Uus remondikood loodud käsitsi',
            jälgimiskood: created.code,
            jälgimise_link: `https://nutifix.ee/#status-${created.code}`,
          }),
        })
      } catch (err) {
        console.warn('Koodi kiri ei läinud:', err)
      }
      setMessage('Kood loodud ja kirjasse saadetud.')
      setNewName(''); setNewPhone(''); setNewDevice(''); setNewService('')
    } catch (err) {
      setMessage('Koodi loomine ebaõnnestus: ' + (err?.message || 'tundmatu viga'))
    } finally {
      setBusy(false)
    }
  }

  const saveInfo = async (e) => {
    e.preventDefault()
    if (!repair) return
    setBusy(true)
    setMessage('')
    try {
      await updateRepairInfo(repair.id, { diagnosis, price })
      setRepair((prev) => ({ ...prev, diagnosis, price }))
      setMessage('Diagnoos ja hind salvestatud — klient näeb neid oma koodiga.')
    } catch (err) {
      setMessage('Salvestamine ebaõnnestus: ' + (err?.message || 'vaata Firestore reegleid'))
    } finally {
      setBusy(false)
    }
  }

  const changeStatus = async (status) => {
    if (!repair) return
    setBusy(true)
    setMessage('')
    try {
      await setRepairStatus(repair.id, status)
      setRepair((prev) => ({ ...prev, status }))
      setMessage('Staatus uuendatud.')
    } catch (err) {
      setMessage('Uuendamine ebaõnnestus: ' + (err?.message || 'vaata Firestore reegleid'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="admin" className="relative py-16">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="nf-eyebrow">TÖÖLAUA TAGA</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Remondihaldus</h2>
          <p className="text-blue-200 text-sm">
            Ainult NutiFixi töötajatele. Staatuse muutmine nõuab sisselogimist.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 sm:p-7">
          {!user ? (
            <form onSubmit={login} className="space-y-4 max-w-md mx-auto">
              <label className="block">
                <span className="block text-sm font-medium mb-1.5 text-blue-300">E-post</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium mb-1.5 text-blue-300">Parool</span>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
              </label>
              <button type="submit" disabled={busy}
                className="w-full py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-60">
                {busy ? 'Hetk…' : 'Logi sisse'}
              </button>
              <p className="text-slate-400 text-xs text-center">
                Kasutaja tuleb luua Firebase Console → Authentication → Users.
              </p>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-center gap-3 mb-6">
                <span className="text-slate-300 text-sm truncate">Sisse logitud: {user.email}</span>
                <button type="button" onClick={() => signOut(auth)}
                  className="shrink-0 text-sm text-blue-300 underline underline-offset-2 bg-transparent border-none cursor-pointer">
                  Logi välja
                </button>
              </div>

              <form onSubmit={search} className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
                  placeholder="NF-2026-XXXXX" aria-label="Jälgimiskood"
                  className="flex-1 px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
                <button type="submit" disabled={busy}
                  className="px-5 py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-60">
                  Otsi
                </button>
              </form>

              <form onSubmit={createCode} className="mt-8 border-t border-white/10 pt-6 space-y-4">
                <div className="text-sm font-semibold text-blue-300">Loo uus kood (kui klient helistas või tuli kohale)</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)}
                    placeholder="Kliendi nimi" aria-label="Kliendi nimi"
                    className="px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
                  <input type="tel" value={newPhone} onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Telefon" aria-label="Telefon"
                    className="px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
                  <input type="text" value={newDevice} onChange={(e) => setNewDevice(e.target.value)}
                    placeholder="Seade (nt iPhone 13)" aria-label="Seade"
                    className="px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
                  <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)}
                    placeholder="Teenus" aria-label="Teenus"
                    className="px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
                </div>
                <button type="submit" disabled={busy}
                  className="px-5 py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-60">
                  Loo kood ja saada kirjasse
                </button>
                {newCode && (
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl px-4 py-3">
                    <div className="text-blue-300 text-xs uppercase tracking-wider mb-1">Uus jälgimiskood</div>
                    <div className="font-mono text-xl font-bold text-white tracking-wider select-all">{newCode}</div>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(newCode); setCode(newCode) }}
                      className="mt-2 text-xs text-blue-300 underline underline-offset-2 bg-transparent border-none cursor-pointer">
                      Kopeeri ja otsi üles
                    </button>
                  </div>
                )}
              </form>

              {repair && (
                <div className="mt-6 bg-slate-900/70 rounded-xl border border-white/10 p-4">
                  <div className="font-mono text-blue-300 font-bold tracking-wider">{repair.code}</div>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm text-slate-200">
                    <div><span className="text-slate-400">Nimi:</span> {repair.name}</div>
                    <div><span className="text-slate-400">Telefon:</span> {repair.phone}</div>
                    <div><span className="text-slate-400">Seade:</span> {repair.device || '—'}</div>
                    <div><span className="text-slate-400">Teenus:</span> {repair.service || '—'}</div>
                    {repair.email && <div className="sm:col-span-2"><span className="text-slate-400">E-post:</span> {repair.email}</div>}
                    {repair.message && <div className="sm:col-span-2"><span className="text-slate-400">Kirjeldus:</span> {repair.message}</div>}
                  </div>

                  <div className="mt-5">
                    <div className="text-sm font-semibold text-blue-300 mb-2">Staatus</div>
                    <div className="flex flex-wrap gap-2">
                      {STAGES.map((stage, index) => (
                        <button key={stage.key} type="button" disabled={busy}
                          onClick={() => changeStatus(index)}
                          className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-all disabled:opacity-60 ${
                            repair.status === index
                              ? 'bg-blue-600 border-blue-400 text-white'
                              : 'bg-slate-800 border-white/15 text-slate-300 hover:border-blue-400'
                          }`}>
                          {index + 1}. {stage.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={saveInfo} className="mt-6 border-t border-white/10 pt-5 space-y-4">
                    <div className="text-sm font-semibold text-blue-300">Info kliendile</div>
                    <label className="block">
                      <span className="block text-sm font-medium mb-1.5 text-blue-300">Diagnoosi tulemused ja märkused</span>
                      <textarea rows="4" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="Nt aku 78 %, ekraani nurk nõrk, SSD korras. Soovitus: aku vahetus."
                        className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm resize-y" />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-medium mb-1.5 text-blue-300">Kinnitatud hind</span>
                      <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}
                        placeholder="Nt 144 € (aku 55 € + ekraan 89 €)"
                        className="w-full px-3 py-2.5 bg-slate-900 border border-white/20 rounded-lg text-white text-sm" />
                    </label>
                    <button type="submit" disabled={busy}
                      className="px-5 py-2.5 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-60">
                      Salvesta ja näita kliendile
                    </button>
                  </form>
                </div>
              )}
            </>
          )}

          {message && <p className="mt-4 text-amber-300 text-sm text-center">{message}</p>}
        </div>
      </div>
    </section>
  )
}

export default Admin
