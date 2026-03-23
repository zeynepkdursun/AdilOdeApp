// MonthCalendar bileşeni
"use client"

import { availableMonths } from "@/data/inflationData"


const MONTH_LABELS_SHORT = [
  "Oca","Şub","Mar","Nis","May","Haz",
  "Tem","Ağu","Eyl","Eki","Kas","Ara"
]

// Bu satır her zaman elindeki listenin en sonundaki ayı (örn: "2026-03") döndürür
const MAX_DATA_MONTH = availableMonths[availableMonths.length - 1];

const DATA_YEARS = Array.from(
  new Set(availableMonths.map((m) => parseInt(m.split("-")[0])))
).sort()

interface MonthCalendarProps {
  isDark: boolean
  selectedKey: string 
  onSelect: (key: string) => void
  rangeStart?: string
  rangeEnd?: string
  activeYear: number
  onYearChange: (year: number) => void
  accentColor?: string 
}

const MonthCalendar = ({
  selectedKey,
  onSelect,
  rangeStart = "",
  rangeEnd = "",
  activeYear,
  isDark,
  onYearChange,
  accentColor = "#f59e0b",
}: MonthCalendarProps) => {
  
  const handleMonthClick = (key: string) => {
    if (!availableMonths.includes(key)) return
    onSelect(key)
  }

  // Tema bazlı stil yardımcıları
  const t = {
    // Yıl butonları
    yearIdle: isDark 
      ? "bg-dark-700 border-dark-500 text-dark-400 hover:border-dark-300 hover:text-white" 
      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800",
    
    // Normal ay butonları (boşta)
    monthIdle: isDark 
      ? "bg-dark-700/40 border-dark-600 text-dark-400 hover:border-dark-400 hover:text-white" 
      : "bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:text-slate-800",
    
    // Veri olmayan (disabled) aylar
    disabled: isDark 
      ? "opacity-20 bg-dark-800 border-dark-700 text-dark-500" 
      : "opacity-20 bg-slate-50 border-slate-100 text-slate-300"
  }

  return (
    <div className="transition-colors duration-300">
      {/* Yıl Seçici Satırı */}
      <div className="flex gap-1.5 mb-2 flex-wrap">
        {DATA_YEARS.map((year) => {
          const isActive = year === activeYear
          return (
            <button
              key={year}
              type="button"
              onClick={() => onYearChange(year)}
              className={`
                px-4 p-2 rounded-lg text-xs font-medium border transition-all duration-150
                ${isActive ? "text-white border-transparent" : t.yearIdle}
              `}
              style={isActive ? { background: accentColor, borderColor: accentColor } : {}}
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

              // --- LOGIC GÜNCELLEMESİ BAŞLANGIÇ ---
          // Eğer seçilen bitiş ayı veri sınırından büyükse, sınırı Mart 2026'ya çek
          const effectiveEnd = rangeEnd && rangeEnd < MAX_DATA_MONTH ? rangeEnd : MAX_DATA_MONTH;
          
          // isInRange: Sadece verisi olan (isAvailable) ve belirlenen sınırın altında kalan aylar
          const isInRange = isAvailable && rangeStart && key > rangeStart && key < effectiveEnd
              // --- LOGIC GÜNCELLEMESİ BİTİŞ ---
          // Aralık hesaplama logic'i
          // const effectiveEnd = rangeEnd || "2026-12"
          // const isInRange = rangeStart && effectiveEnd && key > rangeStart && key < effectiveEnd

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleMonthClick(key)}
              disabled={!isAvailable}
              className={`
                py-2 p-2 rounded-lg text-xs text-center border transition-all duration-150
                ${!isAvailable
                  ? t.disabled
                  : isSelected
                  ? "font-bold text-white shadow-sm scale-[1.02]"
                  : isInRange
                  ? "font-medium" // Arka planı style ile vereceğiz
                  : t.monthIdle
                }
              `}
              style={{
                // Seçili ay: Tam renk
                ...(isSelected ? { 
                  backgroundColor: accentColor, 
                  borderColor: accentColor 
                } : {}),
                
                // Aralık içi ay: Seçilen rengin %15 şeffaf hali
                ...(isInRange && !isSelected ? { 
                  backgroundColor: accentColor + "26", // Hex sonuna 26 eklemek %15 opacity sağlar
                  borderColor: accentColor + "40",    // Kenarlık biraz daha belirgin
                  color: isDark ? "white" : accentColor // Yazı rengini de tema rengi yapalım
                } : {})
              }}
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