// Uygulamada kullanılan tüm TypeScript tip tanımları

// Desteklenen abonelik platformları
export type SubKey = "spotify" | "youtube"

// Paket tanımı — her paketin id, label ve kişi sayısı var
export interface PackageDef {
  id: string
  label: string
  persons: number // bireysel=1, duo=2, aile=6
}

// Fiyat geçmişindeki tek bir dönem
export interface PriceEntry {
  from: string // "YYYY-MM" — bu fiyatın geçerli olmaya başladığı ay
  prices: Record<string, number> // { paketId: TL tutarı }
}

// Bir abonelik platformunun tüm verisi
export interface SubscriptionDef {
  color: string // Tema rengi (hex)
  packages: PackageDef[]
  history: PriceEntry[]
}

// Tek ay hesaplama sonucu
export interface SingleResult {
  month: string
  monthLabel: string
  originalPrice: number // O ay gerçekte ödenen abonelik ücreti
  adjustedPrice: number // Enflasyona göre bugünkü reel değer
  perPerson: number // Kişi başına düşen pay (adjustedPrice / persons)
  inflationRate: number // % enflasyon artışı
  oldIndex: number // O aydaki TÜFE endeksi
  currentIndex: number // Bugünkü TÜFE endeksi
  persons: number // Pakete göre belirlenen kişi sayısı
}

// Tarih aralığı hesaplama sonucu
export interface RangeResult {
  months: SingleResult[]
  totalOriginal: number
  totalAdjusted: number
  totalPerPerson: number
  startLabel: string
  endLabel: string
  persons: number
}

// Hesaplama modu
export type CalcMode = "single" | "range"

// Uygulama geneli form state
export interface AppState {
  sub: SubKey
  pkg: string
  mode: CalcMode
  singleMonth: string
  rangeStart: string
  rangeEnd: string // boş = bugün (CURRENT_MONTH)
  iban: string
}
