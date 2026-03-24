# NeuroTrain Lab

Web app to upload CSV data, clean and explore it, train regression models (Linear, Decision Tree, Random Forest), and review MSE / R² metrics with automated overfitting / underfitting diagnostics.

**Stack:** FastAPI · scikit-learn · pandas · **React + Vite** · Recharts

---

## Live deployment (Render)

Replace these with your own URLs after you deploy:

| Service | Example URL |
|--------|-------------|
| **Backend (API)** | `https://neurotrain-lab-api.onrender.com` |
| **Frontend (static)** | `https://neurotrain-lab-web.onrender.com` |

**Frontend environment variable (required for production):**

- In the Render **Static Site** → **Environment**, set:
  - `VITE_API_URL` = your backend URL (no trailing slash), e.g. `https://neurotrain-lab-api.onrender.com`

Rebuild the static site after changing env vars (Vite bakes `VITE_*` variables in at **build** time).

---

## Deploy on Render (summary)

### Backend — Web Service

1. New **Web Service**, connect this repo.
2. **Root directory:** `backend`
3. **Runtime:** Python (version from `backend/runtime.txt`, e.g. 3.10.x)
4. **Build command:** `pip install -r requirements.txt`
5. **Start command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`

Optional: use the repo root **`render.yaml`** as a [Blueprint](https://render.com/docs/infrastructure-as-code) to provision both services.

- Health check path: `/health`
- CORS is open (`allow_origins=["*"]`) for simple cross-origin access from the static frontend.

### Frontend — Static Site

1. New **Static Site**, same repo.
2. **Root directory:** `frontend`
3. **Build command:** `npm install && npm run build`
4. **Publish directory:** `dist` (Vite output)
5. **Environment:** `VITE_API_URL` = full HTTPS URL of your backend.

For SPA routing refreshes, `render.yaml` includes a rewrite of `/*` → `/index.html`.

---

## Run locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

API: `http://localhost:8000` · OpenAPI: `http://localhost:8000/docs`

### Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000` (configured in `vite.config.js`)

Optional: copy `frontend/.env.example` to `frontend/.env.local` and set `VITE_API_URL=http://localhost:8000`.

### Build frontend (production bundle)

```bash
cd frontend
npm install && npm run build
```

Output folder: **`frontend/dist/`**

---

## Using the app (datasets & training)

1. **Prepare data:** CSV must include a column named **`target`** (regression target). Other columns are features.
2. **Upload** the CSV in the UI (stored under `data/raw.csv` on the server).
3. **Clean** data (e.g. mean imputation for missing numeric values) → writes `data/cleaned.csv`.
4. **Train:** choose model type and hyperparameters, then **Run training**.
5. **Analyze:** review Train / Validation / Test **MSE** and **R²**, charts, diagnostics, and (for tree-based models) feature importance.

On **Render**, the service filesystem is ephemeral unless you add a **persistent disk**; for demos, upload + clean + train in one session. For durable storage, attach a disk and mount it to `data/` (advanced).

---

## Project structure

```
├── backend/
│   ├── app.py           # FastAPI app, CORS, routes
│   ├── paths.py         # data/ and logs/ paths (relative to repo)
│   ├── train.py         # Training, metrics, diagnostics
│   ├── utils.py         # Cleaning helpers
│   ├── requirements.txt
│   ├── runtime.txt
│   └── Procfile         # web: uvicorn ... --port $PORT
├── frontend/            # Vite + React (entry: index.html, src/main.jsx)
├── data/                # raw.csv / cleaned.csv (created at runtime; .csv gitignored by default)
├── logs/                # training_*.json (gitignored)
├── render.yaml          # Optional Render Blueprint
└── README.md
```

---

## Learning curves (roadmap)

The UI includes a **Learning curves** placeholder. A future iteration may plot score vs. training-set size to complement the current split metrics (see `training_analysis.md`).

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Frontend calls wrong API | Browser console: `[NeuroTrain Lab] API base URL: ...` — must match your backend. Redeploy static site after setting `VITE_API_URL`. |
| CORS errors | Backend should expose CORS middleware (already enabled in `app.py`). |
| Training fails | Ensure CSV has `target`, and **Clean** ran successfully so `cleaned.csv` exists. |
| Render sleep | Free tier spins down; first request after idle can be slow. |

---

## Author

Developed by Vivtech.ai as part of the CreativeARC Services Pvt. Ltd. ML Internship Program.


