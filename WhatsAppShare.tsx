// WhatsAppShare — WhatsApp mesajı oluşturur ve paylaşır
"use client"

import { useState } from "react"
import type { SingleResult, RangeResult, AppState } from "@/types"
import { formatCurrency, CURRENT_MONTH } from "@/lib/calculator"
import { formatMonthLabel } from "@/data/inflationData"
import { SUBSCRIPTION_DATA } from "@/data/subscriptionData"

type Result = SingleResult | RangeResult | null

interface WhatsAppShareProps {
  result: Result
  appState: AppState
}

// Mesajı oluşturan yardımcı fonksiyon
const buildMessage = (result: Result, appState: AppState): string => {
  if (!result) return ""

  const subName = appState.sub === "spotify" ? "Spotify" : "YouTube Premium"
  const pkg = SUBSCRIPTION_DATA[appState.sub].packages.find((p) => p.id === appState.pkg)
  const pkgLabel = pkg?.label ?? ""
  const persons = pkg?.persons ?? 1
  const ibanLine = appState.iban ? `\n💳 IBAN: ${appState.iban}` : ""

  // SingleResult mi RangeResult mi olduğunu kontrol et
  // "months" property RangeResult'a özgüdür
  const isRange = "months" in result

  if (!isRange) {
    const r = result as SingleResult
    const ppLine = persons > 1
      ? `\n👥 Kişi Sayısı: ${persons} kişi\n💰 Kişi Başı Pay: *${formatCurrency(r.perPerson)}*`
      : ""
    return `📢 *${subName} (${pkgLabel}) — Adil Hesap*

Merhaba! ${r.monthLabel} tarihinde ödediğimiz abonelik ücretinin bugünkü reel değeri:

💸 *Ödenen Tutar:* ${formatCurrency(r.originalPrice)}
📈 *Bugünkü Reel Değer:* *${formatCurrency(r.adjustedPrice)}*${ppLine}

🔢 Gerçek abonelik tarifeleri + TÜİK TÜFE verileriyle hesaplanmıştır.${ibanLine}

_AdilÖde v3.0_`
  }

  const r = result as RangeResult
  const endLabel = appState.rangeEnd
    ? formatMonthLabel(appState.rangeEnd)
    : formatMonthLabel(CURRENT_MONTH)
  const ppLine = persons > 1
    ? `\n👥 Kişi Sayısı: ${persons} kişi\n💰 Kişi Başı Toplam Pay: *${formatCurrency(r.totalPerPerson)}*`
    : ""

  return `📢 *${subName} (${pkgLabel}) — Adil Hesap*

Merhaba! ${r.startLabel} – ${endLabel} dönemi abonelik ücretlerinin bugünkü reel değeri:

💸 *Toplam Ödenen:* ${formatCurrency(r.totalOriginal)}
📈 *Bugünkü Reel Değer:* *${formatCurrency(r.totalAdjusted)}*${ppLine}

📊 ${r.months.length} aylık hesaplama
🔢 Gerçek abonelik tarifeleri + TÜİK TÜFE verileriyle hesaplanmıştır.${ibanLine}

_AdilÖde v3.0_`
}

const WhatsAppShare = ({ result, appState }: WhatsAppShareProps) => {
  const [isCopied, setIsCopied] = useState(false)

  if (!result) return null

  const message = buildMessage(result, appState)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
    } catch {
      // Fallback: eski yöntem
      const ta = document.createElement("textarea")
      ta.value = message
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
    }
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(message)
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent)
    const url = isMobile
      ? `whatsapp://send?text=${encoded}`
      : `https://web.whatsapp.com/send?text=${encoded}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className="bg-dark-800 border border-dark-600/50 rounded-2xl p-5 space-y-4"
      aria-label="WhatsApp paylaşım bölümü"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-900/30 border border-green-500/20 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
          💬
        </div>
        <div>
          <p className="text-sm font-medium text-white">WhatsApp Mesajı Hazır</p>
          <p className="text-xs text-dark-400">Kopyala veya WhatsApp'ta aç</p>
        </div>
      </div>

      {/* Mesaj önizleme */}
      <pre className="bg-dark-700 border border-dark-600 rounded-xl p-3 text-[11px] text-dark-300 whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto font-body">
        {message}
      </pre>

      {/* Butonlar */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          tabIndex={0}
          aria-label="Mesajı panoya kopyala"
          className={`
            flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
            border transition-all duration-200
            ${isCopied
              ? "bg-green-900/20 border-green-500/40 text-green-400"
              : "bg-dark-700 border-dark-500 text-white hover:border-gold-500/40"
            }
          `}
        >
          <span>{isCopied ? "✅" : "📋"}</span>
          <span>{isCopied ? "Kopyalandı!" : "Metni Kopyala"}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          tabIndex={0}
          aria-label="WhatsApp'ta mesajı aç"
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-green-700 hover:bg-green-600 text-white transition-colors duration-200 active:scale-95"
        >
          <span>📱</span>
          <span>WhatsApp&apos;ta Aç</span>
        </button>
      </div>
    </div>
  )
}

export default WhatsAppShare
