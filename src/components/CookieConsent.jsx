import { useState } from 'react'

const KEY = 'nf-cookie-consent'

function readConsent() {
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return 'declined'
  }
}

function CookieConsent({ onOpenPrivacy }) {
  const [choice, setChoice] = useState(readConsent)

  const decide = (value) => {
    try { window.localStorage.setItem(KEY, value) } catch { /* privaatrežiim */ }
    setChoice(value)
  }

  if (choice) return null

  return (
    <div
      role="region"
      aria-label="Küpsiste teade"
      className="fixed bottom-0 left-0 right-0 z-[90] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4 sm:pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-3xl mx-auto rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-md shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed flex-1">
          Kasutame ainult ühte tehnilist salvestust, et meeles pidada sinu nõusolekut. Reklaami- ega analüütikaküpsiseid meil ei ole.{' '}
          <button
            type="button"
            onClick={onOpenPrivacy}
            className="text-blue-300 underline underline-offset-2 hover:text-blue-200 bg-transparent border-none p-0 cursor-pointer"
          >
            Loe privaatsuspoliitikat
          </button>
        </p>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => decide('declined')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-white/20 text-slate-200 hover:bg-white/10 text-sm transition-all"
          >
            Keeldu
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm transition-all"
          >
            Nõustun
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
