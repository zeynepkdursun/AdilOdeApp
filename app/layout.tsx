// layout.tsx — kök layout, metadata ve favicon burada tanımlanır
import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "AdilÖde — Enflasyon Ayarlı Abonelik Hesaplayıcı",
  description:
    "Spotify ve YouTube Premium abonelik ücretlerinin bugünkü reel değerini TÜİK TÜFE verileriyle hesapla.",
  keywords: ["enflasyon", "abonelik", "spotify", "youtube", "tüfe", "türkiye"],
  // Tarayıcı sekmesinde emoji favicon — ayrı .ico dosyasına gerek yok
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><text y='75' x='50' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='70' fill='white'>₺</text></svg>",
  },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="tr">
    <head>
      {/*
        Emoji favicon — tüm modern tarayıcılarda çalışır.
        SVG içindeki karakter tarayıcı sekmesinde küçük simge olarak görünür.
        "₺" → Türk lirası sembolü, uygulamanın amacını temsil eder.
      */}
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>₺</text></svg>"
      />
    </head>
    <body>{children}</body>
  </html>
)

export default RootLayout