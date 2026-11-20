import { useMemo, useState } from 'react'

const services = [
  {
    icon: "📱",
    title: "Mobiiltelefonide ekraani vahetus",
    description: "Professionaalne ekraanivahetus kõikidele populaarsetele mudelitele.",
    color: "from-purple-500 to-pink-500",
    pricingSlug: null,
    details: ["Samsung, iPhone, Xiaomi, Huawei", "OLED, AMOLED ja LCD paneelid", "Originaal- ja kvaliteetsed analoogid", "Garantii ekraanile"],
  },
  {
    icon: "💻",
    title: "Sülearvutite ekraani vahetus",
    description: "Sülearvuti ekraani vahetus kiirelt ja professionaalselt.",
    color: "from-blue-500 to-cyan-500",
    pricingSlug: "sulearvuti-ekraan",
    details: ["Dell, HP, Lenovo, Apple MacBook", "IPS, TN ja OLED paneelid", "Hinge remont koos ekraaniga", "Garantii"],
  },
  {
    icon: "🔋",
    title: "Mobiiltelefonide aku vahetus",
    description: "Aku vahetus originaal- ja kvaliteetsete analoogakkudega.",
    color: "from-blue-600 to-indigo-700",
    pricingSlug: null,
    details: ["Originaalakud Apple ja Samsung", "Kvaliteetsed analoogakud", "Aku tervise diagnostika", "Garantii akule"],
  },
  {
    icon: "🧹",
    title: "Arvutite hooldus",
    description: "Põhjalik puhastus ja jahutuse optimeerimine.",
    color: "from-teal-500 to-green-500",
    pricingSlug: "arvuti-hooldus",
    details: ["Tolmupuhastus ja termopasta vahetus", "Jahutuse optimeerimine", "Ventilaatori müra vähendamine", "Temperatuuride kontroll"],
  },
  {
    icon: "💾",
    title: "Kõvaketta / andmekandja vahetus",
    description: "Ketta vahetus ja upgrade — kiirem ja mahukam salvestus.",
    color: "from-orange-500 to-amber-500",
    pricingSlug: "kovaketas",
    details: ["HDD → SSD upgrade", "Andmete migreerimine", "M.2 NVMe ja SATA SSD", "Ketta tervise diagnostika"],
  },
  {
    icon: "🔐",
    title: "Andmete varundus & taastamine",
    description: "Kustunud või rikutud andmete päästmine ja varundamine.",
    color: "from-red-500 to-rose-500",
    pricingSlug: "andmed",
    details: ["Kustunud failide taastamine", "Vigaste ketaste lugemine", "SSD ja M.2 ketaste päästmine", "Konfidentsiaalsus"],
  },
  {
    icon: "⚡",
    title: "Arvuti optimeerimine ja kiirendamine",
    description: "Sülearvuti või lauaarvuti kiirendamine ja puhastamine.",
    color: "from-slate-700 to-slate-900",
    pricingSlug: "optimeerimine",
    details: ["Startup optimeerimine", "Pahavara eemaldamine", "Draiverite uuendamine", "Süsteemi puhastus"],
  },
  {
    icon: "🚑",
    title: "IT kiirabi",
    description: "Kiire abi arvuti- ja IT-probleemidele.",
    color: "from-rose-500 to-pink-600",
    pricingSlug: "it-kiirabi",
    details: ["Kaugabi", "Kohapealne abi", "Kiire reageerimine", "Nõustamine ja juhendamine"],
  },
  {
    icon: "📡",
    title: "Ruuterite ja koduvõrkude paigaldus",
    description: "WiFi ja koduvõrgu seadistamine ning optimeerimine.",
    color: "from-indigo-500 to-violet-500",
    pricingSlug: "ruuter",
    details: ["Ruuteri seadistamine", "WiFi katvuse optimeerimine", "Mesh-võrgu paigaldus", "IoT seadmete ühendamine"],
  },
  {
    icon: "🔑",
    title: "Parooli lähtestamine & IT tugi",
    description: "Unustatud paroolide taastamine ja kasutajatugi.",
    color: "from-slate-500 to-gray-500",
    pricingSlug: "parool",
    details: ["Windows parooli lähtestamine", "Android lukustuse eemaldamine", "Andmete säilitamine", "Samm-sammult juhendamine"],
  },
  {
    icon: "💿",
    title: "OS paigaldus & draiverite seadistamine",
    description: "Operatsioonisüsteemide paigaldus ja draiverite uuendamine.",
    color: "from-cyan-500 to-blue-600",
    pricingSlug: "os-paigaldus",
    details: ["Windows 10/11 paigaldus", "Linux distributsioonid", "Draiverite uuendamine", "Programmide seadistamine"],
  },
  {
    icon: "🖨️",
    title: "Printerite ja perifeeria seadistamine",
    description: "Printerite, skannerite ja muude seadmete ühendamine.",
    color: "from-lime-500 to-green-600",
    pricingSlug: "printer",
    details: ["Printeri WiFi ja juhtmega ühendus", "Skannerite seadistamine", "Võrguprinterid", "Tindisüsteemide paigaldus"],
  },
]

function Services() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return services
    return services.filter((service) =>
      `${service.title} ${service.description} ${service.details.join(' ')}`.toLowerCase().includes(needle)
    )
  }, [query])

  const scrollToPricing = (slug) => {
    window.location.hash = slug ? `pricing-${slug}` : 'pricing'
  }

  return (
    <section id="services" className="nf-services-section relative">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 text-white">
          Teenused
        </h2>
        <p className="text-center text-blue-200 mb-5 text-sm sm:text-base">
          Professionaalne remont ja IT-abi kõikidele seadmetele
        </p>

        <div className="nf-services-search">
          <span>🔎</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Otsi teenust, seadet või probleemi..."
            aria-label="Otsi teenust"
          />
          <span className="nf-services-count">{filtered.length} teenust</span>
        </div>

        <div className="nf-services-list">
          {filtered.map((service) => (
            <div className="nf-service-row" key={service.title}>
              <span className="nf-service-row-icon">{service.icon}</span>
              <div className="nf-service-row-copy">
                <b>{service.title}</b>
                <span>{service.description}</span>
              </div>
              <button type="button" onClick={() => scrollToPricing(service.pricingSlug)}>
                Hind →
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-blue-200 py-6">Teenust ei leitud.</p>
          )}
        </div>
      </div>

      <style>{`
        .nf-services-section { padding-top: 30px; padding-bottom: 30px; }
        .nf-services-search {
          display: flex; align-items: center; gap: 10px; max-width: 560px; margin: 0 auto 18px;
          background: rgba(15,23,42,.8); border: 1px solid rgba(255,255,255,.15);
          border-radius: 12px; padding: 0 14px;
        }
        .nf-services-search:focus-within { border-color: #60a5fa; }
        .nf-services-search input {
          flex: 1; min-width: 0; background: transparent; border: none; outline: none;
          color: #fff; font-family: inherit; font-size: 14px; padding: 11px 0;
        }
        .nf-services-search input::placeholder { color: rgba(148,163,184,.8); }
        .nf-services-count { font-size: 11px; color: #93c5fd; white-space: nowrap; }

        .nf-services-list { display: flex; flex-direction: column; gap: 8px; }
        .nf-service-row {
          display: flex; align-items: center; gap: 12px;
          background: rgba(30,41,59,.7); border: 1px solid rgba(255,255,255,.12);
          border-radius: 12px; padding: 12px 14px; transition: .2s;
        }
        .nf-service-row:hover { border-color: rgba(96,165,250,.55); background: rgba(30,41,59,.9); }
        .nf-service-row-icon { font-size: 1.4rem; width: 34px; text-align: center; flex-shrink: 0; }
        .nf-service-row-copy { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .nf-service-row-copy b { color: #fff; font-size: 0.95rem; }
        .nf-service-row-copy span { color: rgba(219,234,254,.7); font-size: 0.78rem; }
        .nf-service-row button {
          background: rgba(59,130,246,.2); border: 1px solid rgba(96,165,250,.5);
          color: #bfdbfe; border-radius: 8px; padding: 7px 12px; font-size: 0.8rem;
          font-weight: 700; cursor: pointer; white-space: nowrap; transition: .2s;
        }
        .nf-service-row button:hover { background: #3b82f6; color: #fff; }

        @media (min-width: 768px) {
          .nf-services-list { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .nf-service-row-copy b { font-size: 1rem; }
        }
      `}</style>
    </section>
  )
}

export default Services
