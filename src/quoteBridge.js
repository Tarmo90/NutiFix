// Ühine sild hinnavaliku ja kontaktivormi vahel.
// Kõik siin olevad teenusenimed peavad ühtima Contact.jsx-i <select> väärtustega.

export const SERVICES = [
  'Mobiiltelefonide ekraani vahetus',
  'Sülearvutite ekraani vahetus',
  'Mobiiltelefonide aku vahetus',
  'Arvutite hooldus',
  'Kõvaketta / andmekandja vahetus',
  'Andmete varundus & taastamine',
  'Arvuti optimeerimine ja kiirendamine',
  'IT kiirabi',
  'Ruuterite ja koduvõrkude paigaldus',
  'Parooli lähtestamine & IT tugi',
  'OS paigaldus & draiverite seadistamine',
  'Printerite ja perifeeria seadistamine',
  'Muu / Ei ole kindel',
]

export const PACKAGES = [
  { value: 'Arvuti Põhipakett', label: 'Arvuti Põhipakett (35 €)' },
  { value: 'Arvuti Hoolduspakett', label: 'Arvuti Hoolduspakett (60 €)' },
  { value: 'Arvuti Täispakett', label: 'Arvuti Täispakett (90 €)' },
]

const VALID = new Set([...SERVICES, ...PACKAGES.map((item) => item.value)])

// Kalkulaatori reald nimed -> vormi teenuseväli.
const QUOTE_SERVICE = {
  'Ekraani vahetus (LCD)': 'Mobiiltelefonide ekraani vahetus',
  'Ekraani vahetus (OLED)': 'Mobiiltelefonide ekraani vahetus',
  'Aku vahetus': 'Mobiiltelefonide aku vahetus',
  'Põhipakett': 'Arvuti Põhipakett',
  'Hoolduspakett': 'Arvuti Hoolduspakett',
  'Täispakett': 'Arvuti Täispakett',
  'Sülearvuti ekraan': 'Sülearvutite ekraani vahetus',
  'HDD → SSD uuendus': 'Kõvaketta / andmekandja vahetus',
  'Andmete päästmine': 'Andmete varundus & taastamine',
  'IT kiirabi (kohapeal)': 'IT kiirabi',
  'Kaugabi': 'IT kiirabi',
  'Windowsi paigaldus': 'OS paigaldus & draiverite seadistamine',
}

// Hinnakirja kategooria -> vormi teenuseväli.
const PRICING_SERVICE = {
  'sulearvuti-ekraan': 'Sülearvutite ekraani vahetus',
  'arvuti-hooldus': 'Arvutite hooldus',
  'kovaketas': 'Kõvaketta / andmekandja vahetus',
  'andmed': 'Andmete varundus & taastamine',
  'optimeerimine': 'Arvuti optimeerimine ja kiirendamine',
  'it-kiirabi': 'IT kiirabi',
  'ruuter': 'Ruuterite ja koduvõrkude paigaldus',
  'parool': 'Parooli lähtestamine & IT tugi',
  'os-paigaldus': 'OS paigaldus & draiverite seadistamine',
  'printer': 'Printerite ja perifeeria seadistamine',
}

export function normalizeService(value) {
  return VALID.has(value) ? value : 'Muu / Ei ole kindel'
}

export function serviceForQuoteLabel(label) {
  return normalizeService(QUOTE_SERVICE[label] || label)
}

export function serviceForPricingSlug(slug) {
  return normalizeService(PRICING_SERVICE[slug])
}

// Saadab valiku kontaktivormi. Tühjad väljad jäetakse puutumata, et
// kasutaja juba sisestatud nimi, telefon ja seade ei kustuks.
export function sendQuote({ service, device = '', message = '' }) {
  window.dispatchEvent(new CustomEvent('nf:quote', {
    detail: {
      service: normalizeService(service),
      device: String(device || ''),
      message: String(message || ''),
    },
  }))
}
