import type { Metadata } from "next"
import "../globals.css"

export const metadata: Metadata = {
  title: "AdilÖde — Enflasyon Ayarlı Abonelik Hesaplayıcı",
  description:
    "Spotify ve YouTube Premium abonelik ücretlerinin bugünkü reel değerini TÜİK TÜFE verileriyle hesapla.",
  keywords: ["enflasyon", "abonelik", "spotify", "youtube", "tüfe", "türkiye"],
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="tr">
    <body>{children}</body>
  </html>
)

export default RootLayout
