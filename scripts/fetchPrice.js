/**
 * LIGONE Market – Preis Fetch (GeckoTerminal)
 * Quelle: LIGONE / WPOL Pool (Polygon)
 * Update: stündlich via GitHub Actions
 */

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const __dirname = new URL(".", import.meta.url).pathname;

// 🔁 WICHTIG: Pool-URL (GeckoTerminal API)
// Falls sich der Pool ändert, NUR HIER anpassen
const API_URL =
  "https://api.geckoterminal.com/api/v2/networks/polygon_pos/pools/0xdaf8744329067b5a2b10a5dfca1c916e099b66d2";

const OUTPUT_FILE = path.join(__dirname, "../data/price-latest.json");

async function run() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("GeckoTerminal API not reachable");

  const json = await res.json();

  const priceUsd =
    Number(json?.data?.attributes?.base_token_price_usd);

  if (!priceUsd || priceUsd <= 0) {
    throw new Error("Invalid price from API");
  }

  // USD → EUR (fixer, ruhig – kein Live-FX-Stress)
  const EUR_RATE = 0.92; // optional später automatisieren
  const priceEur = priceUsd * EUR_RATE;

  const out = {
    price_eur: Number(priceEur.toFixed(10)),
    updated_at: new Date().toISOString(),
    source: "geckoterminal",
    pair: "LIGONE/WPOL"
  };

  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(out, null, 2)
  );

  console.log("✅ Preis aktualisiert:", out.price_eur);
}

run().catch(err => {
  console.error("❌ Preis-Update fehlgeschlagen:", err.message);
  process.exit(1);
});
