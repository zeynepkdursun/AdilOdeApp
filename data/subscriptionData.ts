// Gerçek abonelik fiyat geçmişleri (2021–2026)
// Kaynaklar: Webrazzi, MediaCat, DonanımHaber
//
// Veri yapısı: her "history" girişindeki "from" değeri,
// o fiyatın geçerli olmaya başladığı ilk aydır (dahil).
// Bir sonraki "from" değerine kadar aynı fiyat geçerlidir.

import type { SubscriptionDef } from "@/types"

export const SUBSCRIPTION_DATA: Record<string, SubscriptionDef> = {
  spotify: {
    color: "#1ed760",
    packages: [
      { id: "bireysel", label: "Bireysel", persons: 1 },
      { id: "duo",      label: "Duo",      persons: 2 },
      { id: "aile",     label: "Aile",     persons: 6 },
      { id: "ogrenci",  label: "Öğrenci",  persons: 1 },
    ],
    history: [
      // Ocak 2021 başlangıç fiyatları
      { from: "2021-01", prices: { bireysel: 14.99, duo: 19.99, aile: 22.99, ogrenci: 7.99 } },
      // Şubat 2021 zammı
      { from: "2021-02", prices: { bireysel: 17.99, duo: 23.99, aile: 29.99, ogrenci: 8.99 } },
      // Ağustos 2022 zammı
      { from: "2022-08", prices: { bireysel: 20.99, duo: 27.99, aile: 34.99, ogrenci: 10.49 } },
      // Şubat 2023 zammı
      { from: "2023-02", prices: { bireysel: 29.99, duo: 39.99, aile: 49.99, ogrenci: 15.99 } },
      // Temmuz 2023 zammı
      { from: "2023-07", prices: { bireysel: 39.99, duo: 54.99, aile: 64.99, ogrenci: 21.99 } },
      // Şubat 2024 zammı
      { from: "2024-02", prices: { bireysel: 59.99, duo: 79.99, aile: 99.99, ogrenci: 32.99 } },
      // Ekim 2025 zammı (%66'ya varan artış)
      { from: "2025-10", prices: { bireysel: 99,    duo: 135,   aile: 165,   ogrenci: 55 } },
    ],
  },

  youtube: {
    color: "#ff4444",
    packages: [
      { id: "bireysel", label: "Bireysel", persons: 1 },
      { id: "aile",     label: "Aile",     persons: 6 },
      { id: "ogrenci",  label: "Öğrenci",  persons: 1 },
    ],
    history: [
      // 2021 başlangıç fiyatları
      { from: "2021-01", prices: { bireysel: 16.99, aile: 25.99, ogrenci: 9.99 } },
      // Kasım 2022 — büyük zam (~%241 bireysel)
      { from: "2022-11", prices: { bireysel: 57.99, aile: 59.99, ogrenci: 19.49 } },
      // Kasım 2023 zammı (aile paketi %93 artış)
      { from: "2023-11", prices: { bireysel: 57.99, aile: 115.99, ogrenci: 37.99 } },
      // Kasım 2024 zammı
      { from: "2024-11", prices: { bireysel: 79.99, aile: 159.99, ogrenci: 52.99 } },
      // 2025–2026: değişiklik yok, 2024-11 fiyatları geçerli
    ],
  },
}

// Belirli bir ay için doğru paketi fiyatını döndürür
// En son geçerli "from" değerini bulur
export const getPriceForMonth = (
  subKey: string,
  packageId: string,
  month: string
): number | null => {
  const sub = SUBSCRIPTION_DATA[subKey]
  if (!sub) return null

  let price: number | null = null
  for (const entry of sub.history) {
    // month bu entry'nin başlangıcından büyük/eşitse bu fiyat geçerli
    if (month >= entry.from) {
      price = entry.prices[packageId] ?? null
    }
  }
  return price
}
