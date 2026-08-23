import { useEffect, useState } from "react";

// Points at /public/data/heat_risk_results.json by default.
// Swap DATA_URL (or pass a prop) once the real backend export is ready —
// see README.md for the exact FastAPI/Colab handoff steps.
const DATA_URL = "/data/heat_risk_results.json";

export function useHeatRiskData(url = DATA_URL) {
  const [state, setState] = useState({
    status: "loading", // "loading" | "error" | "ready"
    points: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const points = Array.isArray(data) ? data : data.output ?? [];
        setState({ status: "ready", points, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ status: "error", points: [], error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
