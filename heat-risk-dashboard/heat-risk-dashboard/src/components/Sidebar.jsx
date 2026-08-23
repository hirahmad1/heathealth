import { RISK_BANDS } from "../lib/riskColor";

export default function Sidebar({ points, activeBand, onBandChange }) {
  const total = points.length;
  const critical = points.filter((p) => p.predicted_risk_prob >= 0.72).length;
  const elevated = points.filter(
    (p) => p.predicted_risk_prob >= 0.45 && p.predicted_risk_prob < 0.72
  ).length;
  const avgTemp =
    total > 0
      ? (points.reduce((sum, p) => sum + (p.temp_f ?? 0), 0) / total).toFixed(1)
      : "—";

  const bandCounts = {
    critical,
    elevated,
    low: total - critical - elevated,
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          Live model output
        </div>
        <h1 className="app-title">Heat-Health Risk Predictor</h1>
        <p className="app-subtitle">
          Hyperlocal temperature × social vulnerability, scored per area for
          FortyGuard Hackathon 2026.
        </p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-value">{total || "—"}</div>
          <div className="stat-card-label">Areas scored</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value critical">{critical || "—"}</div>
          <div className="stat-card-label">Critical risk</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value warm">{elevated || "—"}</div>
          <div className="stat-card-label">Elevated risk</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{avgTemp}°F</div>
          <div className="stat-card-label">Avg. temperature</div>
        </div>
      </div>

      <div className="legend-block">
        <p className="legend-title">Risk scale</p>
        <div className="thermal-scale" />
        <div className="thermal-scale-labels">
          <span>Low</span>
          <span>Elevated</span>
          <span>Critical</span>
        </div>
      </div>

      <div className="filter-block">
        <p className="legend-title">Filter by risk band</p>
        <div className="filter-row">
          <button
            className={`filter-chip ${activeBand === null ? "active" : ""}`}
            onClick={() => onBandChange(null)}
          >
            <span className="filter-chip-inner">
              <span
                className="filter-chip-swatch"
                style={{ background: "var(--text-dim)" }}
              />
              All areas
            </span>
            <span className="filter-chip-count">{total}</span>
          </button>

          {RISK_BANDS.map((band) => (
            <button
              key={band.key}
              className={`filter-chip ${activeBand === band.key ? "active" : ""}`}
              onClick={() => onBandChange(band.key)}
            >
              <span className="filter-chip-inner">
                <span
                  className="filter-chip-swatch"
                  style={{ background: band.color }}
                />
                {band.label}
              </span>
              <span className="filter-chip-count">{bandCounts[band.key]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        Reading from <code>/data/heat_risk_results.json</code>. Replace this
        file with the real export from the Colab pipeline
        (<code>heat_risk_results.json</code>, Section&nbsp;7) to go live —
        no code changes needed.
      </div>
    </aside>
  );
}
