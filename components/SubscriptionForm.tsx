// SubscriptionForm — abonelik, paket ve tarih seçimi
"use client"

import { useState } from "react"
import type { AppState, SubKey } from "@/types"
import { SUBSCRIPTION_DATA } from "@/data/subscriptionData"
import { getPriceForMonth } from "@/data/subscriptionData"
import { formatCurrency, CURRENT_MONTH } from "@/lib/calculator"
import { formatMonthLabel } from "@/data/inflationData"
import MonthCalendar from "../MonthCalendar"

interface SubscriptionFormProps {
  state: AppState
  onChange: (partial: Partial<AppState>) => void
}

// Her takvim seçicisinin hangi yılı gösterdiğini tutar
interface CalYears {
  single: number
  start: number
  end: number
}

const SubscriptionForm = ({ state, onChange }: SubscriptionFormProps) => {
  // Takvim yılı state'leri — her picker bağımsız
  const [calYears, setCalYears] = useState<CalYears>({
    single: 2024,
    start: 2024,
    end: 2026,
  })

  const handleYearChange = (picker: keyof CalYears, year: number) => {
    setCalYears((prev) => ({ ...prev, [picker]: year }))
  }

  // Sub butonunun alt yazısını güncelle
  const getSubInfoText = (sub: SubKey): string => {
    const subData = SUBSCRIPTION_DATA[sub]
    const pkg = subData.packages.find((p) => p.id === state.pkg) ?? subData.packages[0]
    const refMonth = (state.mode === "single" ? state.singleMonth : state.rangeStart) || CURRENT_MONTH
    const price = getPriceForMonth(sub, pkg.id, refMonth)
    if (!price) return pkg.label
    const ppSuffix = pkg.persons > 1 ? ` · ${formatCurrency(price / pkg.persons)}/kişi` : ""
    return `${pkg.label} · ${formatCurrency(price)}/ay${ppSuffix}`
  }

  const accentColor = SUBSCRIPTION_DATA[state.sub].color

  // Ortak buton/label class'ları
  const labelClass = "block text-xs text-dark-400 uppercase tracking-widest mb-2 font-medium"

  return (
    <div className="space-y-5">

      {/* BÖLÜM 1: Abonelik Türü */}
      <div>
        <p className={labelClass}>① Abonelik Türü</p>
        <div className="grid grid-cols-2 gap-2">
          {(["spotify", "youtube"] as SubKey[]).map((sub) => {
            const isActive = state.sub === sub
            const color = SUBSCRIPTION_DATA[sub].color
            const emoji = sub === "spotify" ? "🎵" : "▶"
            const name = sub === "spotify" ? "Spotify" : "YouTube Premium"
            return (
              <button
                key={sub}
                type="button"
                onClick={() => {
                  // Paketi sıfırla eğer yeni sub'da mevcut paket yoksa
                  const pkgs = SUBSCRIPTION_DATA[sub].packages
                  const newPkg = pkgs.find((p) => p.id === state.pkg) ? state.pkg : pkgs[0].id
                  onChange({ sub, pkg: newPkg })
                }}
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${name} seç`}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border-2 text-left
                  transition-all duration-200 relative
                  ${isActive ? "" : "bg-dark-700 border-dark-500 hover:border-dark-400"}
                `}
                style={isActive ? {
                  background: color + "14",
                  borderColor: color + "80",
                  boxShadow: `0 0 14px ${color}14`,
                } : {}}
              >
                <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-lg flex-shrink-0">
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium"
                    style={{ color: isActive ? color : undefined }}
                  >
                    {name}
                  </div>
                  <div
                    className="text-xs mt-0.5 truncate"
                    style={{ color: isActive ? color + "99" : "#55557a" }}
                  >
                    {getSubInfoText(sub)}
                  </div>
                </div>
                {isActive && (
                  <span
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Paket Seçimi */}
        <div className="mt-3">
          <p className={labelClass} style={{ marginBottom: "6px" }}>Paket</p>
          <div className="grid grid-cols-4 gap-1.5">
            {SUBSCRIPTION_DATA[state.sub].packages.map((pkg) => {
              const isActive = state.pkg === pkg.id
              const personsTxt = pkg.persons > 1 ? `${pkg.persons} kişi` : "1 kişi"
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => onChange({ pkg: pkg.id })}
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${pkg.label} paketi seç`}
                  className={`
                    p-2 rounded-lg border text-center text-xs transition-all duration-150
                    ${!isActive ? "bg-dark-700 border-dark-500 text-dark-400 hover:border-dark-400" : "font-medium"}
                  `}
                  style={isActive ? {
                    background: accentColor + "18",
                    borderColor: accentColor + "66",
                    color: accentColor,
                  } : {}}
                >
                  <span className="block font-medium">{pkg.label}</span>
                  <span className="block text-[9.5px] mt-0.5 opacity-60">{personsTxt}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* BÖLÜM 2: Hesaplama Modu */}
      <div>
        <p className={labelClass}>② Hesaplama Modu</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {([
            { id: "single", label: "📅 Tek Ay" },
            { id: "range",  label: "📆 Tarih Aralığı" },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ mode: id })}
              tabIndex={0}
              aria-pressed={state.mode === id}
              className={`
                py-2.5 rounded-xl border text-sm font-medium transition-all duration-150
                ${state.mode === id
                  ? "border-gold-500/50 bg-gold-500/10 text-white"
                  : "bg-dark-700 border-dark-500 text-dark-400 hover:border-dark-400"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* TEK AY MODU */}
        {state.mode === "single" && (
          <div>
            <p className={labelClass}>Hesaplanacak Ay</p>
            <MonthCalendar
              selectedKey={state.singleMonth}
              onSelect={(key) => onChange({ singleMonth: key })}
              activeYear={calYears.single}
              onYearChange={(y) => handleYearChange("single", y)}
              accentColor={accentColor}
            />
          </div>
        )}

        {/* TARİH ARALIĞI MODU */}
        {state.mode === "range" && (
          <div className="space-y-4">
            <div>
              <p className={labelClass}>Başlangıç Ayı</p>
              <MonthCalendar
                selectedKey={state.rangeStart}
                onSelect={(key) => onChange({ rangeStart: key })}
                activeYear={calYears.start}
                onYearChange={(y) => handleYearChange("start", y)}
                rangeStart={state.rangeStart}
                rangeEnd={state.rangeEnd || CURRENT_MONTH}
                accentColor={accentColor}
              />
            </div>

            {/* Bölücü */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-dark-500" />
              <span className="text-xs text-dark-400 uppercase tracking-widest">
                Bitiş Ayı (boş = bugün)
              </span>
              <div className="flex-1 h-px bg-dark-500" />
            </div>

            <div>
              <p className={labelClass}>Bitiş Ayı</p>
              <MonthCalendar
                selectedKey={state.rangeEnd}
                onSelect={(key) => onChange({ rangeEnd: key })}
                activeYear={calYears.end}
                onYearChange={(y) => handleYearChange("end", y)}
                rangeStart={state.rangeStart}
                rangeEnd={state.rangeEnd}
                accentColor={accentColor}
              />
            </div>
          </div>
        )}
      </div>

      {/* BÖLÜM 3: IBAN */}
      <div>
        <label htmlFor="iban" className={labelClass}>
          IBAN{" "}
          <span className="text-dark-500 normal-case text-[9px] tracking-normal">
            (isteğe bağlı)
          </span>
        </label>
        <input
          id="iban"
          type="text"
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          value={state.iban}
          onChange={(e) => onChange({ iban: e.target.value })}
          maxLength={32}
          className="
            w-full bg-dark-700 border border-dark-500 text-white placeholder-dark-500/50
            rounded-xl px-4 py-3 text-sm outline-none transition-all duration-150
            focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20
          "
          aria-label="Para transferi için IBAN numarası"
        />
      </div>
    </div>
  )
}

export default SubscriptionForm
