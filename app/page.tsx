// Ana Sayfa — state yönetimi ve bileşen birleştirme
"use client"

import { useState, useMemo } from "react"
import type { AppState, SingleResult, RangeResult } from "@/types"
import { calcSingleMonth, calcDateRange } from "@/lib/calculator"
import SubscriptionForm from "@/components/SubscriptionForm"
import ResultCard from "@/components/ResultCard"
import WhatsAppShare from "@/components/WhatsAppShare"

const INITIAL_STATE: AppState = {
  sub: "spotify",
  pkg: "bireysel",
  mode: "single",
  singleMonth: "",
  rangeStart: "",
  rangeEnd: "",
  iban: "",
}

// ── Toggle Switch bileşeni ───────────────────────────────────────────────────
// Buton yerine iOS tarzı kaydırmalı toggle
interface ToggleProps {
  checked: boolean
  onChange: () => void
  label: string
}

const ThemeToggle = ({ checked, onChange, label }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className="flex items-center gap-2 cursor-pointer group outline-none"
  >
    {/* Güneş ikonu */}
    <span className={`text-sm transition-all duration-300 ${!checked ? "opacity-100 scale-110" : "opacity-30 scale-90"}`}>
      ☀️
    </span>

    {/* Toggle track */}
    <div
      className={`
        relative w-11 h-6 rounded-full border transition-all duration-300 ease-in-out
        ${checked
          ? "bg-slate-800 border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" // Dark Mod Track
          : "bg-amber-100 border-amber-300 shadow-[inset_0_2px_4px_rgba(251,191,36,0.1)]" // Light Mod Track
        }
      `}
    >
      {/* Toggle thumb (Hareketli Yuvarlak) */}
      <div
        className={`
          absolute top-[2px] w-[18px] h-[18px] rounded-full shadow-md
          transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          ${checked
            ? "translate-x-6 bg-amber-400"  // Dark modda sağa kaydır ve belirgin sarı yap
            : "translate-x-[2px] bg-white"  // Light modda solda ve beyaz kalsın
          }
        `}
      />
    </div>

    {/* Ay ikonu */}
    <span className={`text-sm transition-all duration-300 ${checked ? "opacity-100 scale-110" : "opacity-30 scale-90"}`}>
      🌙
    </span>
  </button>
)

// ── Ana Sayfa ────────────────────────────────────────────────────────────────
const HomePage = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE)
  // isDark: true = koyu tema (varsayılan), false = açık tema
  const [isDark, setIsDark] = useState(true)

  const handleChange = (partial: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...partial }))
  }

  const singleResult = useMemo<SingleResult | null>(() => {
    if (state.mode !== "single" || !state.singleMonth) return null
    return calcSingleMonth(state.sub, state.pkg, state.singleMonth)
  }, [state.sub, state.pkg, state.mode, state.singleMonth])

  const rangeResult = useMemo<RangeResult | null>(() => {
    if (state.mode !== "range" || !state.rangeStart) return null
    
    return calcDateRange(state.sub, state.pkg, state.rangeStart, state.rangeEnd)
  }, [state.sub, state.pkg, state.mode, state.rangeStart, state.rangeEnd])

  const activeResult = state.mode === "single" ? singleResult : rangeResult

  // Tema bazlı class yardımcıları — tek yerden yönetim
  const t = {
    bg:      isDark ? "bg-[#0a0a0f]"  : "bg-[#f0ede8]",
    card:    isDark ? "bg-[#1a1a25] border-[rgba(245,158,11,0.15)]" : "bg-white border-[rgba(180,140,30,0.2)]",
    heading: isDark ? "text-[#e6e6e6]"    : "text-[#1c1c24]",
    text:    isDark ? "text-[#e8e8f2]": "text-[#1c1c24]",
    muted:   isDark ? "text-[#8888aa]": "text-[#4a4a5a]",
    hint:    isDark ? "text-[#55557a]": "text-[#7a7a8a]",
    emptyBg: isDark ? "bg-[#111118]/60 border-[#2e2e3e]/50" : "bg-white/60 border-[#d8d0c4]",
  }

  return (
    // data-theme → globals.css'deki [data-theme="light"] seçicisiyle eşleşir
    <main
      className={`min-h-screen transition-colors duration-300 ${t.bg}`}
      data-theme={isDark ? "dark" : "light"}
    >
      {/* Dekoratif arka plan glowları */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            <span className={t.heading}>Adil</span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Öde
            </span>
          </h1>
          {/* Toggle switch — buton değil, iOS tarzı */}
          <ThemeToggle
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
            label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
          />
        </header>

        {/* ── Form Kartı ── */}
        <div className={`rounded-2xl p-5 mb-4 border transition-colors duration-300 ${t.card}`}>
          <SubscriptionForm state={state} onChange={handleChange} isDark={isDark} />
        </div>

        {/* ── Sonuç Kartı ── */}
        {state.mode === "single" ? (
          <ResultCard mode="single" result={singleResult} isDark={isDark} />
        ) : (
          <ResultCard mode="range" result={rangeResult} isDark={isDark} />
        )}

        {/* ── WhatsApp ── */}
        {activeResult && (
          <div className="mt-4">
            <WhatsAppShare result={activeResult} appState={state} isDark={isDark} />
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="text-center mt-8">
          <p className={`text-xs ${t.hint}`}>
            Gerçek abonelik tarifeleri + TÜİK TÜFE endeksi (2021 – Mar 2026)
          </p>
          <p className={`text-xs mt-1 ${t.hint} opacity-60`}>AdilÖde v3.0</p>
        </footer>
      </div>
    </main>
  )
}

export default HomePage