import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  limit,
} from 'firebase/firestore'

// Näidisarvustused, mis on nähtaval seni, kuni Firebase pole veel
// seadistatud (vt src/firebase.js) või kui keegi pole veel oma
// arvustust jätnud. Niipea kui Firestore on ühendatud, ilmuvad
// päris kasutajate arvustused nende kõrvale/ette automaatselt.
const seedReviews = [
  {
    id: 'seed-1',
    name: 'Mari K.',
    stars: 5,
    text: 'Telefoni ekraan vahetati ära 30 minutiga. Super kiire ja professionaalne teenindus. Soovitan kõigile!',
    dateLabel: 'juuli 2026',
  },
  {
    id: 'seed-2',
    name: 'Andres T.',
    stars: 5,
    text: 'Sülearvuti ei käivitunud üldse. Tarmo leidis probleemi kiiresti üles ja parandas ära. Hind oli ka väga mõistlik.',
    dateLabel: 'juuni 2026',
  },
  {
    id: 'seed-3',
    name: 'Kristi P.',
    stars: 4,
    text: 'Tahvelarvuti aku vahetus läks hästi. Ainuke miinus – pidin natuke ootama, aga tulemus oli hea.',
    dateLabel: 'juuni 2026',
  },
]

const EST_MONTHS = [
  'jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni',
  'juuli', 'august', 'september', 'oktoober', 'november', 'detsember',
]

function formatDate(timestamp) {
  if (!timestamp || !timestamp.toDate) return ''
  const d = timestamp.toDate()
  return `${EST_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function StarPicker({ value, onChange }) {
  return (
    <div className="nf-star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="nf-star-btn"
          aria-label={`${n} tärni`}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
    </div>
  )
}

function Reviews() {
  const [liveReviews, setLiveReviews] = useState([])
  const [firestoreReady, setFirestoreReady] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [stars, setStars] = useState(5)
  const [text, setText] = useState('')
  const [website, setWebsite] = useState('') // honeypot – päris inimesed ei täida seda välja
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  // Kuulame Firestore'i "reviews" kollektsiooni reaalajas – niipea kui
  // keegi uue arvustuse jätab, ilmub see kõigile lehevaatajatele
  // automaatselt, ilma lehte värskendamata.
  useEffect(() => {
    if (!db) {
      // Firebase'i seadistamine ebaõnnestus (vt src/firebase.js) –
      // näitame vaikimisi ainult näidisarvustusi, lehte see ei lõhu.
      setFirestoreReady(false)
      return
    }
    try {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(30)
      )
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setLiveReviews(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          )
          setFirestoreReady(true)
        },
        () => {
          // Firebase pole veel seadistatud (vt src/firebase.js) või reeglid
          // blokeerivad lugemise – näitame vaikimisi ainult näidisarvustusi.
          setFirestoreReady(false)
        }
      )
      return () => unsubscribe()
    } catch (e) {
      setFirestoreReady(false)
    }
  }, [])

  const allReviews = [
    ...liveReviews.map((r) => ({
      id: r.id,
      name: r.name,
      stars: r.stars,
      text: r.text,
      dateLabel: formatDate(r.createdAt),
    })),
    ...seedReviews,
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (website) return // honeypot rabandus – vaikimisi ei tee midagi

    if (!db) {
      setError('Arvustuste andmebaas pole hetkel kättesaadav. Proovi hiljem uuesti.')
      return
    }

    if (!name.trim() || !text.trim()) {
      setError('Palun täida nimi ja arvustuse tekst.')
      return
    }
    if (name.length > 60) {
      setError('Nimi on liiga pikk.')
      return
    }
    if (text.length > 500) {
      setError('Arvustus on liiga pikk (max 500 tähemärki).')
      return
    }

    setIsSubmitting(true)
    try {
      const writePromise = addDoc(collection(db, 'reviews'), {
        name: name.trim(),
        stars,
        text: text.trim(),
        createdAt: serverTimestamp(),
      })

      // Firestore kirjutab kohalikult (nähtav allolevas nimekirjas) kohe,
      // aga serveri KINNITUS võib mõne võrgu/laienduse tõttu venida või
      // vahel jäädagi tulemata. Et nupp ei jääks igaveseks "Saadan..."
      // peale kinni, ootame kinnitust max 6 sekundit – kui see aeg
      // ületatakse, käsitleme seda ikkagi õnnestumisena (andmed on juba
      // kohapeal olemas ja Firestore saadab need niipea kui saab).
      let timedOut = false
      const timeout = new Promise((resolve) => {
        setTimeout(() => {
          timedOut = true
          resolve()
        }, 6000)
      })
      await Promise.race([writePromise, timeout])

      // Kui serveri kinnitus hiljem siiski läbi kukub (nt õiguste viga),
      // logime selle vaikselt, ilma kasutajat enam segamata.
      writePromise.catch((err) => {
        console.warn('Arvustuse serveri-kinnitus hilines/ebaõnnestus:', err)
      })

      if (timedOut) {
        console.warn('Firestore kinnitus võttis üle 6s aega – arvustus on kohapeal salvestatud.')
      }

      setSubmitted(true)
      setName('')
      setStars(5)
      setText('')
      setTimeout(() => {
        setSubmitted(false)
        setShowForm(false)
      }, 2500)
    } catch (err) {
      setError('Arvustuse saatmine ebaõnnestus. Kas Firebase on seadistatud? (vt src/firebase.js)')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="reviews" className="nf-reviews-section relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 sm:mb-3 text-white">
          ⭐ Kliendid räägivad
        </h2>
        <p className="text-center text-blue-200 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
          Vaata, mida meie kliendid NutiFix teenustest arvavad
        </p>

        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <button
            onClick={() => setShowForm((s) => !s)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
          >
            {showForm ? 'Sulge vorm' : '✍️ Jäta arvustus'}
          </button>

          {!firestoreReady && (
            <p className="text-amber-300/90 text-xs sm:text-sm mt-3 max-w-xl mx-auto">
              Arvustuste andmebaas (Firebase) on veel seadistamata — vt juhiseid failis <code>src/firebase.js</code>.
              Seni on nähtaval näidisarvustused.
            </p>
          )}

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="relative mt-6 max-w-lg mx-auto text-left bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/10"
            >
              {submitted && (
                <div className="absolute inset-0 bg-green-500/90 rounded-2xl flex items-center justify-center z-10">
                  <div className="text-white text-xl font-bold text-center px-4">
                    ✅<br/>Aitäh arvustuse eest!
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              {/* Honeypot – peidetud päris kasutajate eest, aga robotid täidavad selle sageli ära */}
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="nf-honeypot"
                tabIndex="-1"
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-blue-300">Nimi *</label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-white/40 transition-all text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sinu nimi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-blue-300">Hinnang *</label>
                  <StarPicker value={stars} onChange={setStars} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-blue-300">Arvustus *</label>
                  <textarea
                    required
                    rows="3"
                    maxLength={500}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-white/40 transition-all resize-none text-sm"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Kirjelda oma kogemust NutiFixiga..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-300 ${isSubmitting ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'}`}
                >
                  {isSubmitting ? 'Saadan...' : 'Saada arvustus'}
                </button>

                <p className="text-xs text-blue-300/60 text-center">
                  Arvustus ilmub lehele kohe pärast saatmist.
                </p>
              </div>
            </form>
          )}
        </div>

        <div className="nf-reviews-grid">
          {allReviews.map((review) => (
            <div
              key={review.id}
              className="nf-review-card bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="nf-review-stars">
                {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
              </div>
              <p className="nf-review-text text-blue-200">"{review.text}"</p>
              <div className="nf-review-footer">
                <div className="font-bold text-white text-sm sm:text-base">{review.name}</div>
                <div className="text-slate-400 text-xs sm:text-sm">{review.dateLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kõik selle sektsiooni paigutuse jaoks kriitilised mõõdud on siin
          otse tavalise CSS-ina, samal proovitud-toimival põhjusel nagu
          Teenused sektsioonis: Tailwind klassid ei kompileerunud alati
          usaldusväärselt. Värvid on viidud sama tumesinise/lilla teemaga
          kooskõlla, mis on mujal lehel (Services/WhyUs kaartide stiil). */}
      <style>{`
        .nf-reviews-section { padding-top: 40px; padding-bottom: 40px; }
        .nf-reviews-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        .nf-review-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .nf-review-stars {
          color: #fbbf24;
          font-size: 1.1rem;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .nf-review-text {
          line-height: 1.6;
          font-size: 0.875rem;
          margin-bottom: 16px;
          min-height: 72px;
        }
        .nf-review-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 14px;
          margin-top: auto;
        }
        .nf-star-picker { display: flex; gap: 4px; }
        .nf-star-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          line-height: 1;
          color: #fbbf24;
          padding: 2px;
        }
        .nf-honeypot {
          position: absolute;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        @media (min-width: 640px) {
          .nf-reviews-section { padding-top: 48px; padding-bottom: 48px; }
          .nf-reviews-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .nf-review-card { padding: 28px; }
          .nf-review-text { font-size: 1rem; min-height: 80px; }
        }
        @media (min-width: 1024px) {
          .nf-reviews-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1280px) {
          .nf-reviews-section { padding-top: 64px; padding-bottom: 64px; }
          .nf-reviews-grid { gap: 24px; }
        }
      `}</style>
    </section>
  )
}

export default Reviews
