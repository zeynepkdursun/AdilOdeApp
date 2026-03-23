// Ana Sayfa — tüm state burada yönetilir, bileşenler birleştirilir
"use client"

import { useState, useMemo } from "react"
import type { AppState, SingleResult, RangeResult } from "@/types"
import { calcSingleMonth, calcDateRange, CURRENT_MONTH } from "@/lib/calculator"
import SubscriptionForm from "@/components/SubscriptionForm"
import ResultCard from "@/components/ResultCard"
import WhatsAppShare from "@/components/WhatsAppShare"

// Başlangıç state'i
const INITIAL_STATE: AppState = {
  sub: "spotify",
  pkg: "bireysel",
  mode: "single",
  singleMonth: "",
  rangeStart: "",
  rangeEnd: "",
  iban: "",
}

const HomePage = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE)
  // isDark → tema durumu (true=koyu, false=açık)
  const [isDark, setIsDark] = useState(true)

  // Partial<AppState> → sadece değişen alanları güncelle
  const handleChange = (partial: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...partial }))
  }

  // useMemo → state değişince yeniden hesapla ama gereksiz render'ı engelle
  const singleResult = useMemo<SingleResult | null>(() => {
    if (state.mode !== "single" || !state.singleMonth) return null
    return calcSingleMonth(state.sub, state.pkg, state.singleMonth)
  }, [state.sub, state.pkg, state.mode, state.singleMonth])

  const rangeResult = useMemo<RangeResult | null>(() => {
    if (state.mode !== "range" || !state.rangeStart) return null
    return calcDateRange(state.sub, state.pkg, state.rangeStart, state.rangeEnd)
  }, [state.sub, state.pkg, state.mode, state.rangeStart, state.rangeEnd])

  const activeResult = state.mode === "single" ? singleResult : rangeResult

  return (
    // data-theme attr → globals.css'de :root[data-theme="light"] ile hedeflenir
    <main
      className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-dark-900" : "bg-[#d8d8d0]"}`}
      data-theme={isDark ? "dark" : "light"}
    >
      {/* Dekoratif arka plan */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">
            <span className={isDark ? "text-white" : "text-dark-900"}>Adil</span>
            <span className="bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
              Öde
            </span>
          </h1>
          {/* Tema toggle butonu */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
            className={`
              px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
              ${isDark
                ? "bg-dark-700 border-dark-500 text-dark-300 hover:border-dark-400"
                : "bg-white/60 border-gray-300 text-gray-600 hover:border-gray-400"
              }
            `}
          >
            {isDark ? "☀️ Açık Mod" : "🌙 Koyu Mod"}
          </button>
        </header>

        {/* Form Kartı */}
        <div
          className={`rounded-2xl p-5 mb-4 border ${
            isDark
              ? "bg-dark-800 border-gold-500/15"
              : "bg-white/80 border-amber-200/50"
          }`}
        >
          <SubscriptionForm state={state} onChange={handleChange} />
        </div>

        {/* Sonuç Kartı */}
        {state.mode === "single" ? (
          <ResultCard mode="single" result={singleResult} />
        ) : (
          <ResultCard mode="range" result={rangeResult} />
        )}

        {/* WhatsApp Paylaşım */}
        {activeResult && (
          <div className="mt-4">
            <WhatsAppShare result={activeResult} appState={state} />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-8">
          <p className="text-xs text-dark-400">
            Gerçek abonelik tarifeleri + TÜİK TÜFE endeksi (2021 – Mar 2026)
          </p>
          <p className="text-xs text-dark-500 mt-1">AdilÖde v3.0</p>
        </footer>
      </div>
    </main>
  )
}

export default HomePage
