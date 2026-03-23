// ResultCard — hesaplama sonuçlarını gösterir
// Tek ay (single) ve tarih aralığı (range) modlarını destekler
"use client"

import type { SingleResult, RangeResult } from "@/types"
import { formatCurrency } from "@/lib/calculator"

type ResultCardProps =
  | { mode: "single"; result: SingleResult | null; isDark: boolean }
  | { mode: "range";  result: RangeResult  | null; isDark: boolean }

const ResultCard = (props: ResultCardProps) => {
  const { isDark } = props

  // Tema class'ları
  const card    = isDark
    ? "bg-[#1a1a25] border-[rgba(245,158,11,0.38)] shadow-[0_0_24px_rgba(245,158,11,0.07)]"
    : "bg-white border-[rgba(180,140,30,0.4)] shadow-[0_0_24px_rgba(180,140,30,0.08)]"
  const subCard = isDark
    ? "bg-[#111118]/60 border-[#2e2e3e]/50"
    : "bg-[#f7f4ef] border-[#d8d0c4]"
  const divider = isDark ? "border-[#2e2e3e]" : "border-[#d8d0c4]"
  const txt     = isDark ? "text-[#e8e8f2]"   : "text-[#1c1c24]"
  const muted   = isDark ? "text-[#8888aa]"   : "text-[#4a4a5a]"
  const hint    = isDark ? "text-[#55557a]"   : "text-[#7a7a8a]"
  const badgeBg = isDark ? "bg-[#111118]"     : "bg-[#f0ede8]"

  // Enflasyon oranına göre renk
  const inflColor = (rate: number) =>
    rate > 100 ? "#f87171" : rate > 50 ? "#fb923c" : "#d97706"

  if (!props.result) {
    return (
      <div
        className={`${subCard} border rounded-2xl p-7 text-center`}
        aria-live="polite"
      >
        <div className="flex gap-1.5 justify-center mb-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full animate-pulse ${isDark ? "bg-[#2e2e3e]" : "bg-[#c8c0b8]"}`}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <p className={`text-sm ${hint}`}>Abonelik ve ay seçince sonuçlar belirecek</p>
      </div>
    )
  }

  // ── TEK AY MODU ─────────────────────────────────────────────────────────────
  if (props.mode === "single") {
    const {
      originalPrice, adjustedPrice, perPerson,
      inflationRate, oldIndex, currentIndex, monthLabel, persons,
    } = props.result

    return (
      <div className="space-y-3" aria-live="polite">
        <div className={`${card} border rounded-2xl p-5`}>
          <p className={`text-[10px] uppercase tracking-widest mb-1 ${hint}`}>
            {monthLabel} için bugünkü reel değer
          </p>

          {/*
            SIRALAMA:
            - persons > 1 → büyük rakam = kişi başı, altında toplam (küçük)
            - persons = 1 → sadece tek tutar var, büyük göster
          */}
          {persons > 1 ? (
            <>
              {/* Kişi başı — büyük, öne çıkan */}
              <p className={`text-[10px] uppercase tracking-widest mb-0.5 ${hint}`}>
                Kişi başına ({persons} kişi)
              </p>
              <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none mb-3">
                {formatCurrency(perPerson)}
              </p>
              {/* Toplam — küçük, ikincil */}
              <div className={`pt-3 border-t ${divider} flex items-center gap-2`}>
                <span className={`text-xs ${hint}`}>Toplam reel değer</span>
                <span className={`font-display text-lg font-bold ml-auto ${txt}`}>
                  {formatCurrency(adjustedPrice)}
                </span>
              </div>
            </>
          ) : (
            <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none mb-3">
              {formatCurrency(adjustedPrice)}
            </p>
          )}

          {/* Ödenen eski tutar + enflasyon rozeti */}
          <div className={`flex items-center gap-2 text-sm ${persons > 1 ? "mt-3" : ""}`}>
            <span className={`${muted} line-through text-xs`}>
              Ödenen: {formatCurrency(originalPrice)}
            </span>
            <span
              className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${badgeBg}`}
              style={{ color: inflColor(inflationRate) }}
            >
              +%{inflationRate}
            </span>
          </div>
        </div>

        {/* Formül Detayı */}
        <div className={`${subCard} border rounded-xl p-4`}>
          <p className={`text-[10px] uppercase tracking-widest mb-3 ${hint}`}>
            Hesaplama Detayı
          </p>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <div className="text-center">
              <div className="text-amber-400 font-bold text-sm">
                {currentIndex.toLocaleString("tr-TR")}
              </div>
              <div className={`border-t ${divider} my-0.5`} />
              <div className={muted}>{oldIndex.toLocaleString("tr-TR")}</div>
            </div>
            <span className={hint}>×</span>
            <span className={muted}>{formatCurrency(originalPrice)}</span>
            <span className={hint}>=</span>
            <span className="text-amber-400 font-bold">{formatCurrency(adjustedPrice)}</span>
          </div>
          <p className={`text-[10px] mt-2 ${hint}`}>
            Bugünkü TÜFE ÷ {monthLabel} TÜFE × Gerçek abonelik bedeli
          </p>
        </div>
      </div>
    )
  }

  // ── TARİH ARALIĞI MODU ──────────────────────────────────────────────────────
  const {
    months, totalOriginal, totalAdjusted,
    totalPerPerson, startLabel, endLabel, persons,
  } = props.result

  return (
    <div className="space-y-3" aria-live="polite">
      <div className={`${card} border rounded-2xl p-5`}>
        <p className={`text-[10px] uppercase tracking-widest mb-1 ${hint}`}>
          {startLabel} – {endLabel} · {months.length} ay
        </p>

        {/*
          persons > 1 → büyük = kişi başı toplam, altında toplam reel değer
          persons = 1 → büyük = toplam reel değer
        */}
        {persons > 1 ? (
          <>
            <p className={`text-[10px] uppercase tracking-widest mb-0.5 ${hint}`}>
              Kişi başına toplam ({persons} kişi)
            </p>
            <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none mb-3">
              {formatCurrency(totalPerPerson)}
            </p>
            {/* Toplam reel değer — ikincil */}
            <div className={`pt-3 border-t ${divider} flex items-center gap-2`}>
              <span className={`text-xs ${hint}`}>Toplam reel değer</span>
              <span className={`font-display text-lg font-bold ml-auto ${txt}`}>
                {formatCurrency(totalAdjusted)}
              </span>
            </div>
          </>
        ) : (
          <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none mb-3">
            {formatCurrency(totalAdjusted)}
          </p>
        )}

        <div className={`flex items-center gap-2 text-sm ${persons > 1 ? "mt-3" : ""}`}>
          <span className={`${muted} line-through text-xs`}>
            Toplam ödenen: {formatCurrency(totalOriginal)}
          </span>
          <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${badgeBg} text-amber-400`}>
            {months.length} ay
          </span>
        </div>
      </div>

      {/* Aylık Döküm Tablosu */}
      <div className={`${subCard} border rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <p className={`text-[10px] uppercase tracking-widest ${hint}`}>Aylık Döküm</p>
          <span className={`text-xs ${muted}`}>{months.length} ödeme</span>
        </div>

        <div className="max-h-56 overflow-y-auto pr-1">
          {/* Başlık satırı */}
          <div
            className={`grid text-[10px] uppercase tracking-wider pb-2 mb-1 border-b ${divider} ${hint}`}
            style={{
              gridTemplateColumns: persons > 1 ? "1.3fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr",
            }}
          >
            <span>Ay</span>
            <span>Ödendi</span>
            <span>Reel Değer</span>
            {persons > 1 && <span>Kişi Başı</span>}
          </div>

          {/* Veri satırları */}
          {months.map((r) => (
            <div
              key={r.month}
              className={`grid py-1.5 border-b text-xs items-center ${divider}`}
              style={{
                gridTemplateColumns: persons > 1 ? "1.3fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr",
              }}
            >
              <span className={muted}>{r.monthLabel}</span>
              <span className={`${hint} line-through text-[11px]`}>
                {formatCurrency(r.originalPrice)}
              </span>
              <span className="text-amber-400 font-medium">
                {formatCurrency(r.adjustedPrice)}
              </span>
              {persons > 1 && (
                <span className={`${txt} text-[11px]`}>{formatCurrency(r.perPerson)}</span>
              )}
            </div>
          ))}

          {/* Toplam satırı */}
          <div
            className="grid pt-2 mt-1 text-sm font-medium border-t border-amber-500/30"
            style={{
              gridTemplateColumns: persons > 1 ? "1.3fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr",
            }}
          >
            <span className={txt}>Toplam</span>
            <span className={`${hint} line-through text-xs`}>
              {formatCurrency(totalOriginal)}
            </span>
            <span className="text-amber-400 font-display font-bold">
              {formatCurrency(totalAdjusted)}
            </span>
            {persons > 1 && (
              <span className="text-amber-300 font-bold">
                {formatCurrency(totalPerPerson)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard