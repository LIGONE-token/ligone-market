/* =========================================
   LIGONE Market – Linienchart v1
   Beobachtungsansicht · ruhig · stabil
========================================= */

const container = document.getElementById("price-chart");

if (!container) {
  console.warn("Chart container not found");
} else {

   container.innerHTML = "";

  // Chart erstellen
  const chart = LightweightCharts.createChart(container, {
  width: container.clientWidth,
  height: 260, // ← explizit!
  layout: {
    background: { color: "#ffffff" },
    textColor: "#6b7280",
  },
  grid: {
    vertLines: { color: "#f0f2f4" },
    horzLines: { color: "#f0f2f4" },
  },
  timeScale: {
    borderColor: "#e5e7eb",
    timeVisible: true,
    secondsVisible: false,
  },
  rightPriceScale: {
    borderColor: "#e5e7eb",
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
  },
});


  // Linie hinzufügen
  const lineSeries = chart.addLineSeries({
    color: "#2563eb",
    lineWidth: 2,
  });

  // Daten laden (Default: 7 Tage)
  loadChartData("data/price-7d.json");

  // Responsive
  window.addEventListener("resize", () => {
    chart.applyOptions({ width: container.clientWidth });
  });

  // Zeitrahmen-Buttons
  document.querySelectorAll(".chart-timeframes button").forEach(btn => {
    btn.addEventListener("click", () => {

      document.querySelectorAll(".chart-timeframes button")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      const label = btn.textContent.trim();

      if (label === "24h") {
        loadChartData("data/price-24h.json");
      } else if (label === "30 Tage") {
        loadChartData("data/price-30d.json");
      } else {
        loadChartData("data/price-7d.json");
      }
    });
  });

  // Daten-Funktion
  function loadChartData(url) {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        // Erwartetes Format:
        // [{ time: "2026-01-10", value: 0.00000123 }, ...]
        lineSeries.setData(data);
        chart.timeScale().fitContent();
      })
      .catch(err => {
        console.error("Chart data error:", err);
      });
  }
}

