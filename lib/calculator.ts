// Hesaplama Motoru
// Formül: Güncel Değer = (Bugünkü TÜFE / O Aydaki TÜFE) × Gerçek Abonelik Ücreti

import { inflationData, formatMonthLabel } from "@/data/inflationData"
import { getPriceForMonth } from "@/data/subscriptionData"
import type { SingleResult, RangeResult } from "@/types"

// Uygulamanın "bugün" kabul ettiği ay — veri setinin son ayı
export const CURRENT_MONTH = "2026-03"

// "2024-01" → "2024-02" şeklinde bir sonraki ayı döndürür
export const nextMonth = (month: string): string => {
  const [y, m] = month.split("-").map(Number)
  // Aralık (12) → yeni yılın Ocak'ına geç
  if (m === 12) return `${y + 1}-01`
  // padStart(2, "0") → "1" → "01" formatı
  return `${y}-${String(m + 1).padStart(2, "0")}`
}

// Başlangıç ve bitiş arasındaki tüm ay anahtarlarını dizi olarak döndürür
export const getMonthsBetween = (start: string, end: string): string[] => {
  const result: string[] = []
  let current = start
  while (current <= end) {
    result.push(current)
    current = nextMonth(current)
  }
  return result
}

// ─── TEK AY HESAPLAMA ────────────────────────────────────────────────────────
export const calcSingleMonth = (
  subKey: string,
  packageId: string,
  month: string
): SingleResult | null => {
  // O ay için gerçek abonelik fiyatını veri tabanından çek
  const originalPrice = getPriceForMonth(subKey, packageId, month)
  if (!originalPrice) return null

  const oldIndex = inflationData[month]
  const currentIndex = inflationData[CURRENT_MONTH]
  if (!oldIndex || !currentIndex) return null

  // Paketin kişi sayısını al (duo=2, aile=6, diğerleri=1)
  const { SUBSCRIPTION_DATA } = require("@/data/subscriptionData")
  const pkg = SUBSCRIPTION_DATA[subKey]?.packages.find(
    (p: { id: string }) => p.id === packageId
  )
  const persons = pkg?.persons ?? 1

  // ANA FORMÜL: Güncel Değer = (Bugünkü Endeks / Eski Endeks) × Fiyat
  const adjustedPrice = (currentIndex / oldIndex) * originalPrice
  const perPerson = adjustedPrice / persons
  const inflationRate = ((currentIndex - oldIndex) / oldIndex) * 100

  return {
    month,
    monthLabel: formatMonthLabel(month),
    originalPrice,
    // Math.round(...*100)/100 → 2 ondalık basamağa yuvarla
    adjustedPrice: Math.round(adjustedPrice * 100) / 100,
    perPerson: Math.round(perPerson * 100) / 100,
    inflationRate: Math.round(inflationRate * 10) / 10,
    oldIndex,
    currentIndex,
    persons,
  }
}

// ─── TARİH ARALIĞI HESAPLAMA ─────────────────────────────────────────────────
export const calcDateRange = (
  subKey: string,
  packageId: string,
  startMonth: string,
  endMonth: string // boş gelirse CURRENT_MONTH kullanılır
): RangeResult | null => {
  const end = endMonth || CURRENT_MONTH
  if (startMonth > end) return null

  const months = getMonthsBetween(startMonth, end)

  // Her ay için hesapla, null olanları filtrele
  // .filter(Boolean) → null/undefined değerleri diziden çıkarır
  const results = months
    .map((m) => calcSingleMonth(subKey, packageId, m))
    .filter(Boolean) as SingleResult[]

  if (results.length === 0) return null

  const persons = results[0].persons

  // .reduce() → diziyi tek değere indirger (toplama işlemi)
  const totalOriginal = results.reduce((sum, r) => sum + r.originalPrice, 0)
  const totalAdjusted = results.reduce((sum, r) => sum + r.adjustedPrice, 0)
  const totalPerPerson = totalAdjusted / persons

  return {
    months: results,
    totalOriginal: Math.round(totalOriginal * 100) / 100,
    totalAdjusted: Math.round(totalAdjusted * 100) / 100,
    totalPerPerson: Math.round(totalPerPerson * 100) / 100,
    startLabel: formatMonthLabel(startMonth),
    endLabel: formatMonthLabel(end),
    persons,
  }
}

// Para formatlama: 1234.5 → "₺1.234,50"
export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
