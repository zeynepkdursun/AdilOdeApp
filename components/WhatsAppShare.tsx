// WhatsAppShare — WhatsApp mesajı oluşturur ve paylaşır
"use client"

import { useState } from "react"
import type { SingleResult, RangeResult, AppState } from "@/types"
import { formatCurrency, CURRENT_MONTH } from "@/lib/calculator"
import { formatMonthLabel } from "../data/inflationData"
import { SUBSCRIPTION_DATA } from "../data/subscriptionData"

type Result = SingleResult | RangeResult | null

interface WhatsAppShareProps {
  result: Result
  appState: AppState
  isDark: boolean // lowercase 'boolean' TS standartıdır
}

const buildMessage = (result: Result, appState: AppState): string => {
  if (!result) return ""

  const subName = appState.sub === "spotify" ? "Spotify" : "YouTube Premium"
  const pkg = SUBSCRIPTION_DATA[appState.sub].packages.find((p) => p.id === appState.pkg)
  const pkgLabel = pkg?.label ?? ""
  const persons = pkg?.persons ?? 1
  const ibanLine = appState.iban ? `\n💳 IBAN: ${appState.iban}` : ""

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

const WhatsAppShare = ({ result, appState, isDark }: WhatsAppShareProps) => {
  const [isCopied, setIsCopied] = useState(false)

  if (!result) return null

  const message = buildMessage(result, appState)

  // Tema bazlı stil yardımcıları
  const t = {
    cardBg:    isDark ? "bg-[#1a1a25] border-[#2e2e3e]/50" : "bg-white border-amber-500/20",
    textMain:  isDark ? "text-white"                        : "text-[#1c1c24]",
    textMuted: isDark ? "text-[#8888aa]"                    : "text-[#4a4a5a]",
    previewBg: isDark ? "bg-[#111118] border-[#2e2e3e]"    : "bg-[#fdfcfb] border-[#e5e0d8]",
    copyBtn:   isDark ? "bg-[#1f1f2e] border-[#2e2e3e]"    : "bg-[#f1efe9] border-[#d8d0c4]",
    iconBg:    isDark ? "bg-green-900/30 border-green-500/20" : "bg-green-100 border-green-200",
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
    } catch {
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
      className={`${t.cardBg} border rounded-2xl p-5 space-y-4 transition-colors duration-300 shadow-sm`}
      aria-label="WhatsApp paylaşım bölümü"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${t.iconBg} rounded-lg flex items-center justify-center text-sm flex-shrink-0`}>
          💬
        </div>
        <div>
          <p className={`text-sm font-semibold ${t.textMain}`}>WhatsApp Mesajı Hazır</p>
          <p className={`text-xs ${t.textMuted}`}>Kopyala veya WhatsApp&apos;ta aç</p>
        </div>
      </div>

      {/* Mesaj önizleme */}
      <pre className={`${t.previewBg} border rounded-xl p-3 text-[11px] ${t.textMuted} whitespace-pre-wrap leading-relaxed max-h-28 overflow-y-auto font-sans`}>
        {message}
      </pre>

      {/* Butonlar */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={`
            flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
            border transition-all duration-200 active:scale-95
            ${isCopied
              ? "bg-green-500/10 border-green-500/40 text-green-600 dark:text-green-400"
              : `${t.copyBtn} ${t.textMain} hover:border-amber-500/40`
            }
          `}
        >
          <span>{isCopied ? "✅" : "📋"}</span>
          <span>{isCopied ? "Kopyalandı!" : "Metni Kopyala"}</span>
        </button>

        <button
          type="button"
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-[#25D366] hover:bg-[#20bd5b] text-white transition-all duration-200 active:scale-95 shadow-sm"
        >
          <span>📱</span>
          <span>WhatsApp&apos;ta Aç</span>
        </button>
      </div>
    </div>
  )
}

export default WhatsAppShare