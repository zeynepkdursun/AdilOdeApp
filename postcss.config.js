// PostCSS → CSS'i işleyip dönüştüren araç
// Tailwind bu araç üzerinden çalışır
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Farklı tarayıcılar için -webkit- gibi prefix'leri otomatik ekler
  },
}
