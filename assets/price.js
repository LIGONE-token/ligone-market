/* =========================================
   LIGONE Market – Preisbox v1
========================================= */

fetch("data/price-latest.json")
  .then(res => res.json())
  .then(data => {
    const price = Number(data.price_eur);
    if (!price || price <= 0) return;

    const priceEl = document.querySelector(".price-value");
    const exampleEl = document.querySelector(".price-example");
    const metaEl = document.querySelector(".price-meta");

    // Preis anzeigen
    priceEl.textContent =
      price.toLocaleString("de-DE", {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      }) + " €";

    // Umrechnung
    const ligPerEuro = Math.floor(1 / price).toLocaleString("de-DE");
    exampleEl.textContent = `1 € ≈ ${ligPerEuro} LIG1`;

    // Zeit
    const date = new Date(data.updated_at);
    metaEl.textContent =
      "Letzte Aktualisierung: " +
      date.toLocaleString("de-DE");
  })
  .catch(err => {
    console.warn("Price load failed", err);
  });
