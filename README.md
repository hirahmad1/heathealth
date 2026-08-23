# Heat-Health Risk Predictor

**Live demo:** [heathealth.netlify.app](https://heathealth.netlify.app/)


Heat doesn't hit every neighborhood the same way. Two areas can have the exact same temperature and face very different health outcomes — because one has more elderly residents, less AC access, or fewer cooling centers nearby. This project predicts **who's actually at risk**, not just where it's hot, by combining hyperlocal temperature data with social vulnerability data — and explains *why* each area is flagged.

## What it does

- Pulls hyperlocal temperature data for Los Angeles from the **FortyGuard Temperature API**
- Merges it with real **CDC Social Vulnerability Index (2020)** data at the census-tract level
- Trains a Random Forest model to predict heat-health risk per area, validated with a **spatial train/test split** to avoid geographic data leakage
- Surfaces **feature-level explainability** — for every flagged area, shows whether temperature, social vulnerability, or both are driving the risk
- Renders results on an interactive dashboard: color-coded map, risk filters, and a click-through panel with the per-area breakdown

## Live demo

[**heathealth.netlify.app**](https://heathealth.netlify.app/)

Click any point on the map to see its predicted risk, temperature, vulnerability score, and a plain-language explanation of why it was flagged.

## Tech stack

| Layer | Tools |
|---|---|
| Data | FortyGuard Temperature API, CDC Social Vulnerability Index 2020 |
| Processing / ML | Python, pandas, geopandas, scikit-learn (RandomForestClassifier) |
| Notebook environment | Google Colab |
| Frontend | React, Vite, Leaflet (react-leaflet), CSS |
| Deployment | Netlify (static export of the trained model's predictions) |

## Repo structure

```
heat_health_risk_predictor.ipynb   — full data pipeline: fetch → merge → train → explain → export
dashboard_template.html            — self-contained HTML dashboard (CDN React + Leaflet, no build step)
dashboard_preview.html             — same dashboard pre-filled with sample data, opens directly in any browser
heat-risk-dashboard/               — full React + Vite project (the production frontend)
  src/
    components/                    — Sidebar, MapView, AreaDetailPanel
    lib/                           — risk color scale, data loading hook
  public/data/                     — heat_risk_results.json (swap in real export here)
```

## Model

- **Features:** temperature (°F), social vulnerability score
- **Validation:** spatial split (trained on one geographic region, tested on a held-out region) to prevent leakage between adjacent grid tiles
- **Accuracy:** ~93% on held-out spatial test set
- **Explainability:** feature importances from the trained Random Forest, surfaced per-area on the dashboard

## Running the notebook

1. Open `heat_health_risk_predictor.ipynb` in Google Colab
2. Add your `FORTYGUARD_API_KEY` to Colab's Secrets (or set `CACHED = True` to use bundled sample data)
3. Run all cells top to bottom — Section 7 exports `heat_risk_results.json`

## Running the frontend locally

```bash
cd heat-risk-dashboard
npm install
npm run dev
```

Opens at `http://localhost:5173` with sample data. To use real predictions, replace `public/data/heat_risk_results.json` with the file exported from the notebook — no code changes needed.

## Team

Built by **Hira** (data pipeline, ML model, backend) and **Manahil Zulfiqar** (frontend, UX, pitch) 
