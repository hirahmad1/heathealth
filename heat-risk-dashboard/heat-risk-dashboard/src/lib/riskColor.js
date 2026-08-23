// Shared thermal color scale for risk probability (0 -> 1).
// Keep this as the single source of truth so the map, legend, and
// detail panel never drift out of sync with each other.

const STOPS = [
  { at: 0.0, color: [34, 211, 199] }, // heat-cool
  { at: 0.45, color: [253, 186, 77] }, // heat-warm
  { at: 0.72, color: [251, 122, 60] }, // heat-hot
  { at: 1.0, color: [226, 59, 59] }, // heat-critical
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function riskToColor(prob) {
  const p = Math.min(Math.max(prob ?? 0, 0), 1);
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (p >= a.at && p <= b.at) {
      const t = (p - a.at) / (b.at - a.at || 1);
      const r = Math.round(lerp(a.color[0], b.color[0], t));
      const g = Math.round(lerp(a.color[1], b.color[1], t));
      const bch = Math.round(lerp(a.color[2], b.color[2], t));
      return `rgb(${r}, ${g}, ${bch})`;
    }
  }
  return `rgb(${STOPS[STOPS.length - 1].color.join(", ")})`;
}

export function riskToLabel(prob) {
  if (prob >= 0.72) return "Critical";
  if (prob >= 0.45) return "Elevated";
  return "Low";
}

export const RISK_BANDS = [
  { key: "critical", label: "Critical", min: 0.72, max: 1.01, color: "rgb(226, 59, 59)" },
  { key: "elevated", label: "Elevated", min: 0.45, max: 0.72, color: "rgb(251, 122, 60)" },
  { key: "low", label: "Low", min: 0, max: 0.45, color: "rgb(34, 211, 199)" },
];
