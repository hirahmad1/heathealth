import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import { riskToColor } from "../lib/riskColor";

function FitToPoints({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    const bounds = points.map((p) => [p.lat, p.lon]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [points, map]);

  return null;
}

export default function MapView({ points, selectedId, onSelect }) {
  const center = useMemo(() => {
    if (!points.length) return [34.05, -118.24];
    const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const lon = points.reduce((s, p) => s + p.lon, 0) / points.length;
    return [lat, lon];
  }, [points]);

  return (
    <MapContainer
      center={center}
      zoom={13}
      zoomControl={false}
      attributionControl={false}
      style={{ background: "#060b14" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
      />
      <FitToPoints points={points} />

      {points.map((p) => {
        const color = riskToColor(p.predicted_risk_prob);
        const isSelected = selectedId === p.area_id;
        return (
          <CircleMarker
            key={p.area_id}
            center={[p.lat, p.lon]}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color: isSelected ? "#eaf0fa" : color,
              weight: isSelected ? 2 : 1,
              fillColor: color,
              fillOpacity: isSelected ? 0.95 : 0.75,
            }}
            eventHandlers={{
              click: () => onSelect(p.area_id),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>
                {p.area_id} · {p.temp_f?.toFixed(1)}°F ·{" "}
                {(p.predicted_risk_prob * 100).toFixed(0)}% risk
              </span>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
