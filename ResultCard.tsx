// ResultCard — tek ay veya tarih aralığı sonuçlarını gösterir
"use client"

import type { SingleResult, RangeResult } from "@/types"
import { formatCurrency } from "@/lib/calculator"

// İki mod için union tip — ya single ya range sonucu gelir
type ResultCardProps =
  | { mode: "single"; result: SingleResult | null }
  | { mode: "range";  result: RangeResult | null }

const ResultCard = (props: ResultCardProps) => {
  if (!props.result) {
    return (
      <div
        className="bg-dark-800/60 border border-dark-600/50 rounded-2xl p-7 text-center"
        aria-live="polite"
        aria-label="Hesaplama sonuçları bekleniyor"
      >
        <div className="flex gap-1.5 justify-center mb-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-dark-500 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-dark-400">Abonelik ve ay seçince sonuçlar belirecek</p>
      </div>
    )
  }

  // Enflasyon oranına göre renk seç
  const getInflColor = (rate: number) =>
    rate > 100 ? "#f87171" : rate > 50 ? "#fb923c" : "#facc15"

  if (props.mode === "single") {
    const { originalPrice, adjustedPrice, perPerson, inflationRate, oldIndex, currentIndex, monthLabel, persons } = props.result
    const ic = getInflColor(inflationRate)

    return (
      <div className="space-y-3" aria-live="polite">
        {/* Ana Sonuç */}
        <div className="bg-dark-800 border border-gold-500/40 rounded-2xl p-5 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
          <p className="text-[10px] text-dark-400 uppercase tracking-widest mb-1">
            {monthLabel} için bugünkü reel değer
          </p>
          <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none mb-3">
            {formatCurrency(adjustedPrice)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-dark-400 line-through">{formatCurrency(originalPrice)}</span>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-dark-700"
              style={{ color: ic }}
            >
              +%{inflationRate}
            </span>
          </div>
          {/* Kişi başına (sadece persons > 1 ise göster) */}
          {persons > 1 && (
            <div className="mt-3 pt-3 border-t border-dark-600 flex items-baseline gap-2">
              <span className="text-xs text-dark-400">Kişi başına ({persons} kişi)</span>
              <span className="font-display text-xl font-bold text-white ml-2">
                {formatCurrency(perPerson)}
              </span>
              <span className="text-xs text-dark-500">/ kişi</span>
            </div>
          )}
        </div>

        {/* Formül Detayı */}
        <div className="bg-dark-800/50 border border-dark-600/50 rounded-xl p-4">
          <p className="text-[10px] text-dark-500 uppercase tracking-widest mb-3">Hesaplama Detayı</p>
          <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
            <div className="text-center">
              <div className="text-amber-400 font-bold text-sm">{currentIndex.toLocaleString("tr-TR")}</div>
              <div className="border-t border-dark-500 my-0.5" />
              <div className="text-dark-400">{oldIndex.toLocaleString("tr-TR")}</div>
            </div>
            <span className="text-dark-500">×</span>
            <span className="text-dark-400">{formatCurrency(originalPrice)}</span>
            <span className="text-dark-500">=</span>
            <span className="text-amber-300 font-bold">{formatCurrency(adjustedPrice)}</span>
          </div>
          <p className="text-[10px] text-dark-500 mt-2">
            Bugünkü TÜFE ÷ {monthLabel} TÜFE × Gerçek abonelik bedeli
          </p>
        </div>
      </div>
    )
  }

  // RANGE modu
  const { months, totalOriginal, totalAdjusted, totalPerPerson, startLabel, endLabel, persons } = props.result

  return (
    <div className="space-y-3" aria-live="polite">
      {/* Toplam Sonuç */}
      <div className="bg-dark-800 border border-gold-500/40 rounded-2xl p-5 shadow-[0_0_24px_rgba(245,158,11,0.08)]">
        <p className="text-[10px] text-dark-400 uppercase tracking-widest mb-1">
          {startLabel} – {endLabel} toplam reel değer ({months.length} ay)
        </p>
        <p className="font-display text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent leading-none mb-3">
          {formatCurrency(totalAdjusted)}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-dark-400 line-through">{formatCurrency(totalOriginal)}</span>
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-dark-700 text-amber-400">
            {months.length} ay
          </span>
        </div>
        {persons > 1 && (
          <div className="mt-3 pt-3 border-t border-dark-600 flex items-baseline gap-2">
            <span className="text-xs text-dark-400">Kişi başına toplam ({persons} kişi)</span>
            <span className="font-display text-xl font-bold text-white ml-2">
              {formatCurrency(totalPerPerson)}
            </span>
          </div>
        )}
      </div>

      {/* Aylık Döküm Tablosu */}
      <div className="bg-dark-800 border border-dark-600/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-dark-500 uppercase tracking-widest">Aylık Döküm</p>
          <span className="text-xs text-dark-400">{months.length} ödeme</span>
        </div>
        <div className="max-h-56 overflow-y-auto space-y-0 pr-1">
          {/* Tablo başlığı */}
          <div
            className="grid text-[10px] text-dark-500 uppercase tracking-wider pb-2 mb-1 border-b border-dark-600"
            style={{ gridTemplateColumns: persons > 1 ? "1.3fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr" }}
          >
            <span>Ay</span>
            <span>Ödendi</span>
            <span>Reel Değer</span>
            {persons > 1 && <span>Kişi Başı</span>}
          </div>
          {months.map((r) => (
            <div
              key={r.month}
              className="grid py-1.5 border-b border-dark-700 text-xs items-center"
              style={{ gridTemplateColumns: persons > 1 ? "1.3fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr" }}
            >
              <span className="text-dark-400">{r.monthLabel}</span>
              <span className="text-dark-500 line-through text-[11px]">{formatCurrency(r.originalPrice)}</span>
              <span className="text-amber-400 font-medium">{formatCurrency(r.adjustedPrice)}</span>
              {persons > 1 && <span className="text-dark-300 text-[11px]">{formatCurrency(r.perPerson)}</span>}
            </div>
          ))}
          {/* Toplam satırı */}
          <div
            className="grid pt-2 mt-1 text-sm font-medium border-t border-amber-500/30"
            style={{ gridTemplateColumns: persons > 1 ? "1.3fr 1fr 1fr 1fr" : "1.5fr 1fr 1fr" }}
          >
            <span className="text-white">Toplam</span>
            <span className="text-dark-400 line-through text-xs">{formatCurrency(totalOriginal)}</span>
            <span className="text-amber-400 font-display font-bold">{formatCurrency(totalAdjusted)}</span>
            {persons > 1 && <span className="text-amber-300">{formatCurrency(totalPerPerson)}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
