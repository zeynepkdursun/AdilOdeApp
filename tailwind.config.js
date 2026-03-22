// Tailwind CSS yapılandırması
// "content" → Tailwind hangi dosyalardaki class'ları tarasın diye söylüyoruz
// Taranmayan dosyalardaki class'lar build'e dahil olmaz (dosya boyutunu küçültür)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Özel fontları Tailwind'e tanıtıyoruz
      // CSS variables kullanarak layout.tsx'ten aktarılacak
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      // Özel renk paleti — "altın" teması
      colors: {
        gold: {
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        dark: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a25",
          600: "#252535",
          500: "#32324a",
        },
      },
      // Özel animasyonlar
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [],
}
