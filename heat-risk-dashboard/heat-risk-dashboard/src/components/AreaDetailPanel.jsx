import { riskToColor, riskToLabel } from "../lib/riskColor";

// From the RandomForest's feature_importances_ (Section 6 of the notebook).
// Update these two numbers whenever the model is retrained.
const FEATURE_IMPORTANCE = {
  temp_f: 0.708,
  svi_score: 0.292,
};

function explainArea(point) {
  const tempShare = FEATURE_IMPORTANCE.temp_f;
  const sviShare = FEATURE_IMPORTANCE.svi_score;
  const hotter = point.temp_f >= 97.6;
  const vulnerable = point.svi_score >= 0.55;

  if (hotter && vulnerable) {
    return "Flagged because this area combines above-average heat with high social vulnerability — the two factors compound rather than offset.";
  }
  if (hotter) {
    return `Driven mainly by temperature (${(tempShare * 100).toFixed(
      0
    )}% of the model's weight) — this tile runs hotter than most of the grid, even with moderate vulnerability.`;
  }
  if (vulnerable) {
    return `Driven mainly by social vulnerability (${(sviShare * 100).toFixed(
      0
    )}% of the model's weight) — temperature here is close to average, but the population has limited capacity to cope with heat.`;
  }
  return "Both temperature and social vulnerability sit near the grid average, keeping this area's score low.";
}

export default function AreaDetailPanel({ point, onClose }) {
  if (!point) {
    return (
      <div className="detail-panel">
        <div className="detail-empty">
          <div className="detail-empty-icon">◎</div>
          <p className="detail-empty-text">
            Click any point on the map to see its risk breakdown and why the
            model flagged it.
          </p>
        </div>
      </div>
    );
  }

  const color = riskToColor(point.predicted_risk_prob);
  const label = riskToLabel(point.predicted_risk_prob);
  const probPct = Math.round(point.predicted_risk_prob * 100);

  return (
    <div className="detail-panel" key={point.area_id}>
      <button className="detail-panel-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <span
        className="detail-tag"
        style={{ color, borderColor: color }}
      >
        {label} risk
      </span>

      <div className="detail-area-id">{point.area_id}</div>
      <h2 className="detail-headline">{probPct}% predicted risk</h2>

      <div className="detail-metric">
        <div className="detail-metric-row">
          <span className="detail-metric-label">Temperature</span>
          <span className="detail-metric-value">
            {point.temp_f?.toFixed(1)}°F
          </span>
        </div>
        <div className="detail-bar-track">
          <div
            className="detail-bar-fill"
            style={{
              width: `${Math.min(
                ((point.temp_f - 95) / (100 - 95)) * 100,
                100
              )}%`,
              background: "var(--heat-hot)",
            }}
          />
        </div>
      </div>

      <div className="detail-metric">
        <div className="detail-metric-row">
          <span className="detail-metric-label">Social vulnerability</span>
          <span className="detail-metric-value">
            {point.svi_score?.toFixed(2)}
          </span>
        </div>
        <div className="detail-bar-track">
          <div
            className="detail-bar-fill"
            style={{
              width: `${(point.svi_score ?? 0) * 100}%`,
              background: "var(--heat-cool)",
            }}
          />
        </div>
      </div>

      <div className="detail-metric">
        <div className="detail-metric-row">
          <span className="detail-metric-label">Coordinates</span>
          <span className="detail-metric-value">
            {point.lat?.toFixed(4)}, {point.lon?.toFixed(4)}
          </span>
        </div>
      </div>

      <div className="detail-explain">
        <p className="detail-explain-title">Why this area was flagged</p>
        <p className="detail-explain-text">{explainArea(point)}</p>
      </div>
    </div>
  );
}
