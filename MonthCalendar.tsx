// MonthCalendar bileşeni — yıl butonları + ay grid'i şeklinde takvim seçici
// Dropdown yerine bu kullanılıyor; çok daha kullanıcı dostu
"use client"

import { availableMonths } from "@/data/inflationData"

const MONTH_LABELS_SHORT = [
  "Oca","Şub","Mar","Nis","May","Haz",
  "Tem","Ağu","Eyl","Eki","Kas","Ara"
]

// Veri setindeki ilk ve son yılı hesapla
const DATA_YEARS = Array.from(
  new Set(availableMonths.map((m) => parseInt(m.split("-")[0])))
).sort()

interface MonthCalendarProps {
  selectedKey: string // Seçili ay ("YYYY-MM"), boş olabilir
  onSelect: (key: string) => void
  // Tarih aralığı modunda in-range renklendirme için
  rangeStart?: string
  rangeEnd?: string
  // Hangi yıl görüntüleniyor (dışarıdan kontrol edilir)
  activeYear: number
  onYearChange: (year: number) => void
  accentColor?: string // Tema rengi (Spotify=yeşil, YouTube=kırmızı)
}

const MonthCalendar = ({
  selectedKey,
  onSelect,
  rangeStart = "",
  rangeEnd = "",
  activeYear,
  onYearChange,
  accentColor = "#f59e0b",
}: MonthCalendarProps) => {
  const handleMonthClick = (key: string) => {
    // Veri setinde yoksa (devre dışı ay) tıklamayı engelle
    if (!availableMonths.includes(key)) return
    onSelect(key)
  }

  return (
    <div>
      {/* Yıl Seçici Satırı */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {DATA_YEARS.map((year) => {
          const isActive = year === activeYear
          return (
            <button
              key={year}
              type="button"
              onClick={() => onYearChange(year)}
              tabIndex={0}
              aria-label={`${year} yılını göster`}
              aria-pressed={isActive}
              className={`
                px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-150
                ${isActive
                  ? "text-white border-transparent"
                  : "bg-dark-700 border-dark-500 text-dark-400 hover:border-dark-300 hover:text-white"
                }
              `}
              style={isActive ? { background: accentColor + "22", borderColor: accentColor + "88", color: "white" } : {}}
            >
              {year}
            </button>
          )
        })}
      </div>

      {/* Ay Grid'i — 4 sütun */}
      <div className="grid grid-cols-4 gap-1.5">
        {MONTH_LABELS_SHORT.map((label, i) => {
          const monthNum = String(i + 1).padStart(2, "0")
          const key = `${activeYear}-${monthNum}`
          const isAvailable = availableMonths.includes(key)
          const isSelected = key === selectedKey

          // Tarih aralığı modu: başlangıç-bitiş arası ayları renklendir
          const effectiveEnd = rangeEnd || "2026-03"
          const isInRange =
            rangeStart && effectiveEnd && key > rangeStart && key < effectiveEnd

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleMonthClick(key)}
              tabIndex={isAvailable ? 0 : -1}
              disabled={!isAvailable}
              aria-pressed={isSelected}
              aria-label={`${label} ${activeYear}`}
              className={`
                py-2 px-1 rounded-lg text-xs text-center border transition-all duration-150
                ${!isAvailable
                  ? "opacity-30 cursor-not-allowed bg-dark-800 border-dark-700 text-dark-500"
                  : isSelected
                  ? "font-semibold text-white"
                  : isInRange
                  ? "bg-gold-500/5 border-gold-500/20 text-dark-400 hover:border-dark-300"
                  : "bg-dark-700 border-dark-500 text-dark-400 hover:border-dark-300 hover:text-white cursor-pointer"
                }
              `}
              style={
                isSelected
                  ? { background: accentColor + "22", borderColor: accentColor + "88" }
                  : {}
              }
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthCalendar
