import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AreaDetailPanel from "./components/AreaDetailPanel";
import { useHeatRiskData } from "./lib/useHeatRiskData";
import { RISK_BANDS } from "./lib/riskColor";

export default function App() {
  const { status, points, error } = useHeatRiskData();
  const [activeBand, setActiveBand] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const filteredPoints = useMemo(() => {
    if (!activeBand) return points;
    const band = RISK_BANDS.find((b) => b.key === activeBand);
    if (!band) return points;
    return points.filter(
      (p) => p.predicted_risk_prob >= band.min && p.predicted_risk_prob < band.max
    );
  }, [points, activeBand]);

  const selectedPoint = points.find((p) => p.area_id === selectedId) ?? null;

  return (
    <div className="app-shell">
      <Sidebar
        points={points}
        activeBand={activeBand}
        onBandChange={(band) => {
          setActiveBand(band);
          setSelectedId(null);
        }}
      />

      <div className="map-area">
        {status === "loading" && (
          <div className="center-state">
            <div className="spinner" />
            Loading heat-risk grid…
          </div>
        )}

        {status === "error" && (
          <div className="center-state">
            Couldn't load /data/heat_risk_results.json — {error}
          </div>
        )}

        {status === "ready" && (
          <>
            <div className="map-topbar">
              Showing <strong>{filteredPoints.length}</strong> of{" "}
              <strong>{points.length}</strong> areas
            </div>
            <MapView
              points={filteredPoints}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
            <AreaDetailPanel
              point={selectedPoint}
              onClose={() => setSelectedId(null)}
            />
          </>
        )}
      </div>
    </div>
  );
}
