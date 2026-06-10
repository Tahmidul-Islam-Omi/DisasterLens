# DisasterLens

![FastAPI](https://img.shields.io/badge/FastAPI-Python_3.10+-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React_18-TypeScript-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Motor_async-47A248?logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=googlegemini&logoColor=white)
![Status](https://img.shields.io/badge/status-in_development-orange)

AI-powered disaster management platform for Bangladesh — real-time news ingestion, AI impact analysis, geospatial risk mapping, and volunteer coordination, with a fully bilingual (English & বাংলা) interface.

## How It Works

```
News & Official Feeds          AI Pipeline                    Dashboards
─────────────────────          ───────────────────            ─────────────────
Prothom Alo scraper   ──┐                                  ┌─ Geospatial risk map
FFWC flood bulletins  ──┼──►  Dedup (SHA-256) ──►          ├─ Impact summary
BMD weather feeds     ──┤     Qwen/Gemini summarize ──►    ├─ Live weather map
UNOSAT hazard maps    ──┘     BN ⇄ EN translate ──►        └─ Risk pipeline
                              Impact snapshots
```

1. Ingestion runs (triggered via `POST /api/v1/ingestion/news/run`) crawl enabled sources: the Prothom Alo environment section and official feeds listed in [`sources.txt`](./Backend/sources.txt) (FFWC PDF bulletins, BMD forecasts, UNOSAT hazard maps, met.no, HDX).
2. Articles are deduplicated by content fingerprint, filtered by disaster keywords, summarized with **Qwen** (via Hugging Face Router, Gemini as fallback, heuristic extractive as last resort), and translated Bengali ⇄ English.
3. The LLM then generates **impact snapshots** — fatalities, missing, rescued, estimated losses, danger level, priority actions, and recovery needs — which power the dashboards.
4. Live weather flows in from **met.no** (per division/district) and **FFWC water-level stations** feed the geospatial risk analytics.
5. Authorities and volunteers add ground truth: infrastructure exposure reports, vulnerable communities, GPS coverage updates, tasks, field reports, and missing-person reports — and can broadcast **SMS alerts** (AI-simplified) to community members via sms.net.bd.

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Backend  | FastAPI, MongoDB (Motor async), JWT auth (python-jose, PBKDF2), Qwen (HF Router) + Gemini (LangChain), sms.net.bd SMS gateway, BeautifulSoup4 + httpx scraping, pypdf, deep-translator |
| Frontend | React 18 + TypeScript, Vite, React Router 7, Tailwind CSS 4, shadcn/ui (Radix), Leaflet maps, Recharts, PWA (vite-plugin-pwa) |
| i18n     | Custom bilingual context — every entity stores English + Bengali (`*Bn`) fields |
| Deploy   | Backend on Render ([`render.yaml`](./Backend/render.yaml)), Frontend on Netlify ([`netlify.toml`](./Frontend/netlify.toml)) |

## Repository Layout

```
DisasterLens/
├── Backend/              # FastAPI service
│   ├── app/
│   │   ├── routes/       # auth, authority, volunteer, ingestion, health
│   │   ├── services/     # ingestion orchestrator, LLM gateway, auth, translation
│   │   ├── sources/      # news source adapters (Prothom Alo, sources.txt feeds)
│   │   ├── summarizers/  # AI summarizer providers + fallback chain
│   │   ├── jobs/         # geo reference import (divisions → unions)
│   │   ├── schemas/      # Pydantic request/response models
│   │   ├── config/       # settings (env-driven)
│   │   └── db/           # Mongo client
│   ├── scripts/          # standalone scraper prototypes (FFWC, met.no)
│   ├── sources.txt       # official feed URLs to ingest
│   └── render.yaml       # Render deployment config
└── Frontend/             # React app
    └── src/app/
        ├── pages/        # ~30 role-based views
        ├── components/   # shared components + shadcn/ui
        ├── contexts/     # Auth, Role
        ├── config/       # route permissions per role
        └── i18n/         # EN/BN translations
```

## Quick Start

**Prerequisites:** Python 3.10+, Node.js 18+, MongoDB 4.4+ (local or Atlas), Hugging Face token and/or Google Gemini API key (optional — AI features degrade to heuristic summaries without them).

### 1. Clone

```bash
git clone https://github.com/Tahmidul-Islam-Omi/DisasterLens.git
cd DisasterLens
```

### 2. Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # set MONGODB_URI, SECRET_KEY, GEMINI_API_KEY
python main.py
```

Backend runs at `http://localhost:8000` — interactive docs at **http://localhost:8000/api/docs**. Sample data is seeded automatically on first startup.

### 3. Frontend

```bash
cd Frontend
npm install

# .env
# VITE_API_BASE_URL=http://localhost:8000/api/v1
# VITE_APP_NAME=DisasterLens

npm run dev
```

Open **http://localhost:5173**, then register an account on the Sign Up tab (choose a role: Admin, LocalAuthority, or Volunteer).

### 4. (Optional) Import geo reference data & trigger ingestion

```bash
curl -X POST http://localhost:8000/api/v1/ingestion/geo/import   # BD divisions/districts/upazilas/unions
curl -X POST http://localhost:8000/api/v1/ingestion/news/run     # crawl + summarize + impact analysis
```

## User Roles

| Role | Capabilities | Landing page |
|------|--------------|--------------|
| **Admin** | Geospatial risk dashboard, infrastructure exposure, vulnerable communities, AI risk pipeline, impact summary, incident logs, queries | `/` |
| **LocalAuthority** | Volunteer & task management, alert creation, community responses, member database, village status, missing persons | `/volunteer-coverage` |
| **Volunteer** | Personal dashboard, assigned tasks, GPS coverage updates, infrastructure exposure logging, field reports, missing persons | `/volunteer-dashboard` |

## API Overview

All endpoints are prefixed with **`/api/v1`**. Full interactive reference: `/api/docs` (Swagger) or `/api/redoc`.

| Group | Examples |
|-------|----------|
| Auth | `POST /api/v1/auth/register` · `POST /api/v1/auth/login` · `GET /api/v1/auth/me` |
| Authority | `GET /api/v1/authority/dashboard/overview` · `POST /api/v1/authority/tasks` · `GET /api/v1/authority/geospatial-risk` · `POST /api/v1/authority/missing-persons` · `POST /api/v1/authority/vulnerable-communities` |
| Volunteer | `GET /api/v1/volunteer/dashboard` · `POST /api/v1/volunteer/coverage-updates` · `POST /api/v1/volunteer/field-reports` · `POST /api/v1/volunteer/activity-logs` · `POST /api/v1/volunteer/community-status` · `POST /api/v1/volunteer/infra-exposures` |
| Public (no auth) | `GET /api/v1/public/division-weather` · `GET /api/v1/public/district-weather/live?district=...` · `GET /api/v1/public/weather-alerts` |
| Ingestion | `POST /api/v1/ingestion/news/run` · `GET /api/v1/ingestion/impact/latest` · `POST /api/v1/ingestion/impact/run` · `POST /api/v1/ingestion/geo/import` |
| Health | `GET /api/v1/health` |

Every response uses a standard envelope: `{ "success": bool, "message": str, "data": ... }`.

## Configuration

Key backend environment variables (see [`.env.example`](./Backend/.env.example) for the full list):

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=disasterlens

# Security
SECRET_KEY=change-me-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60

# AI — Qwen via Hugging Face Router (primary), Gemini (fallback)
HF_TOKEN=your-hf-token
QWEN_MODEL=Qwen/Qwen3.5-397B-A17B
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# SMS broadcasts (sms.net.bd)
SMSNETBD_ENABLED=False
SMSNETBD_API_KEY=

# News sources
SOURCE_ENABLE_PROTHOM_ALO=True
SOURCE_ENABLE_SOURCES_TXT=True
```

Frontend (`Frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=DisasterLens
```

## Database

MongoDB with 27+ collections covering users, volunteers, tasks, community responses, weather/authority alerts, incidents, missing persons, infrastructure exposure, vulnerable communities, the news pipeline (`news_articles_raw` → `news_articles_processed`, `official_feed_*`, `intel_articles`, `impact_summary_snapshots`), and Bangladesh geo reference data (`geo_divisions` → `geo_unions`).

Full schema reference: [MONGODB_SCHEMA.md](./Backend/MONGODB_SCHEMA.md)

## Project Status

This project is under active development. Current state:

**Working**
- ✅ JWT auth with role-based access (Admin / LocalAuthority / Volunteer)
- ✅ News ingestion pipeline: Prothom Alo scraper + official feeds (FFWC PDFs, BMD, UNOSAT, met.no) with dedup and hazard tagging
- ✅ AI summarization (BN/EN): Qwen via HF Router → Gemini → heuristic fallback chain, with translation
- ✅ AI impact snapshots feeding the impact summary & geospatial dashboards
- ✅ Live weather: public division/district endpoints backed by met.no + FFWC water-level station analytics
- ✅ SMS alert broadcasts to union community members (sms.net.bd) with AI message simplification and delivery logs
- ✅ Volunteer workflows persisted end-to-end: field reports, activity logs, community status, GPS coverage, infrastructure exposure, task completion
- ✅ Vulnerable communities, missing-person reports, task / volunteer / alert / community CRUD for authorities
- ✅ Bilingual UI, PWA install + offline caching, role-gated routing

**In progress / planned**
- 🚧 Authority registration backend (UI exists, endpoint pending)
- 🚧 Request validation (Pydantic schemas) and auth coverage for ingestion endpoints
- 🚧 Scheduled background ingestion (worker removed for hosting limits; ingestion is currently API-triggered)
- 🚧 Location resolution to district/upazila codes for ingested news
- 🚧 Daily Star source adapter
- 🚧 Missing-person matching engine
- 🚧 Automated tests

## Deployment

- **Backend (Render):** [`render.yaml`](./Backend/render.yaml) defines the service (`rootDir: Backend`, `uvicorn app.main:app`). Set `MONGODB_URI`, `GEMINI_API_KEY`, and `CORS_ALLOWED_ORIGINS` in the Render dashboard.
- **Frontend (Netlify):** [`netlify.toml`](./Frontend/netlify.toml) builds from `Frontend` with SPA redirects. Set `VITE_API_BASE_URL` to your deployed backend's `/api/v1` URL.

## Documentation

- [Backend README](./Backend/README.md) — API and development guide
- [Frontend README](./Frontend/README.md) — frontend development guide
- [MongoDB Schema](./Backend/MONGODB_SCHEMA.md) — full collection reference

## Acknowledgments

- [Google Gemini](https://ai.google.dev/) — AI summarization & impact analysis
- [FFWC](https://www.ffwc.gov.bd/) & [BMD](https://live8.bmd.gov.bd/) — official flood & weather data
- [UNOSAT](https://unosat.org/) — hazard & risk mapping
- [banglageoapi](https://github.com/m3h3d1ha2an/banglageoapi) — Bangladesh administrative geo data
- [Prothom Alo](https://www.prothomalo.com/) — news content
- [OpenStreetMap](https://www.openstreetmap.org/) — map tiles

---

**Built with ❤️ for disaster resilience in Bangladesh 🇧🇩**
