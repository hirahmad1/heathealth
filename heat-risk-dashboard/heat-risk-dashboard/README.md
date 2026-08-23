# Heat-Health Risk Predictor — Frontend

React + Leaflet dashboard for the FortyGuard Hackathon 2026 heat-risk
project. Loads the JSON exported by the Colab pipeline
(`heat_risk_results.json`) and renders each scored area as a color-coded
point on a dark basemap, with a click-through explainability panel.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. It runs out of the box against a small
**sample dataset** (80 synthetic points) at
`public/data/heat_risk_results.json`, so you can see the whole UI before
plugging in real data.

## Wiring up the real data

1. From the Colab notebook, download the real `heat_risk_results.json`
   (Section 7 — "Export results for the React frontend").
2. Replace `public/data/heat_risk_results.json` with that file. No code
   changes needed — the app reads whatever is at `/data/heat_risk_results.json`
   at runtime.
3. Required fields per record (this is exactly what the notebook already
   outputs):

   ```json
   {
     "area_id": "tile_0",
     "lat": 34.037992,
     "lon": -118.25799,
     "temp_f": 97.21724,
     "svi_score": 0.4745,
     "predicted_risk": 0,
     "predicted_risk_prob": 0.3954
   }
   ```

4. If the backend ends up served from FastAPI/MongoDB instead of a static
   file (e.g. `GET /api/heat-risk`), change the `DATA_URL` constant in
   `src/lib/useHeatRiskData.js` — everything else stays the same.

## Updating the explainability text

`src/components/AreaDetailPanel.jsx` has a `FEATURE_IMPORTANCE` constant
(`temp_f: 0.708, svi_score: 0.292`) pulled from the notebook's Section 6
(`clf.feature_importances_`). Update those two numbers whenever the model
is retrained so the "why this area was flagged" copy stays accurate.

## Project structure

```
src/
  App.jsx                     — layout + state (selected area, active filter)
  components/
    Sidebar.jsx                — stats, thermal legend, risk-band filters
    MapView.jsx                — Leaflet map, color-coded circle markers
    AreaDetailPanel.jsx        — slide-in panel with per-area explanation
  lib/
    riskColor.js                — single source of truth for the color scale
    useHeatRiskData.js          — fetches + normalizes the JSON
  index.css                     — design tokens (colors, type, layout)
```

## Design notes

Dark "thermal scanner" theme — deep navy background, Space Grotesk for
headings, JetBrains Mono for coordinates/scores, and a four-stop heat scale
(teal → amber → orange → red) used consistently across the legend, map
markers, and detail panel. The scanning highlight on the legend bar and the
pulsing "live" dot in the sidebar are the two deliberate motion accents —
everything else stays still so the map data reads clearly.

## Build for deployment

```bash
npm run build
```

Outputs static files to `dist/` — deploy anywhere (Vercel, Netlify, Railway
static hosting, GitHub Pages).
