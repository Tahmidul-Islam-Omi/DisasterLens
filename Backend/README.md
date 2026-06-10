# DisasterLens Backend API

FastAPI backend for the DisasterLens disaster management platform: news ingestion, AI-powered summarization and impact analysis, live weather, SMS alert broadcasting, and volunteer/authority coordination.

## Tech Stack

- **Framework**: FastAPI + Uvicorn
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose), PBKDF2 password hashing
- **AI/LLM**: Qwen via Hugging Face Router (primary), Google Gemini via LangChain (fallback), heuristic extractive summaries (last resort)
- **SMS**: sms.net.bd gateway
- **Scraping**: httpx + BeautifulSoup4, pypdf (FFWC PDF bulletins)
- **Translation**: deep-translator (Bengali ⇄ English)

## Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # then edit (see Configuration below)
python main.py
```

Server starts at `http://localhost:8000`:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

Sample data (volunteers, tasks, alerts, members, etc.) is seeded automatically on first startup.

> **Note:** all API endpoints are prefixed with **`/api/v1`** (e.g. `POST /api/v1/auth/login`).

## Configuration

Key environment variables (see `.env.example` for the full list):

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `disasterlens` |
| `SECRET_KEY` | JWT signing key | change in production |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT lifetime | `60` |
| `AI_SUMMARIZER_PROVIDER` | Primary summarizer | `qwen` |
| `AI_SUMMARIZER_FALLBACKS` | Fallback chain | `mistral,gemini` |
| `IMPACT_ANALYSIS_PROVIDER` | Impact analysis LLM | `qwen` |
| `HF_TOKEN` | Hugging Face Router token (for Qwen) | — |
| `QWEN_MODEL` | Qwen model id | `Qwen/Qwen3.5-397B-A17B` |
| `GEMINI_API_KEY` | Gemini API key (fallback LLM) | — |
| `GEMINI_MODEL` | Gemini model | `gemini-2.5-flash` |
| `SMSNETBD_ENABLED` | Enable SMS broadcasts | `False` |
| `SMSNETBD_API_KEY` | sms.net.bd API key | — |
| `SMSNETBD_FORCE_TO` | Override recipient (testing) | — |
| `SOURCE_ENABLE_PROTHOM_ALO` | Enable Prothom Alo scraper | `True` |
| `SOURCE_ENABLE_SOURCES_TXT` | Enable `sources.txt` official feeds | `True` |
| `GEO_DATA_FILE` | Local BD geo dataset | `app/utils/geo_data.json` |

Without `HF_TOKEN`/`GEMINI_API_KEY` the API still runs — summaries fall back to extractive heuristics.

## Project Structure

```
Backend/
├── app/
│   ├── config/          # Settings (env-driven, pydantic-settings)
│   ├── db/              # Mongo client singleton
│   ├── jobs/            # Geo reference import (divisions → unions)
│   ├── routes/
│   │   ├── auth_routes.py        # register / login / me
│   │   ├── public_routes.py      # no-auth live weather + alerts
│   │   ├── authority_routes.py   # dashboards, tasks, alerts, SMS, geospatial risk
│   │   ├── volunteer_routes.py   # coverage, field reports, activity logs
│   │   ├── ingestion_routes.py   # news ingestion + impact analysis triggers
│   │   └── health_routes.py
│   ├── schemas/         # Pydantic request/response models
│   ├── services/
│   │   ├── ingestion_orchestrator.py        # crawl → dedup → summarize → snapshot
│   │   ├── llm_gateway.py                   # Qwen (HF Router) + Gemini gateways
│   │   ├── sms_service.py                   # sms.net.bd wrapper
│   │   ├── district_weather_live_service.py # met.no live weather per district
│   │   ├── summarization_service.py         # provider fallback chain
│   │   ├── translation_service.py           # BN → EN
│   │   └── auth_service.py
│   ├── sources/         # Source adapters (Prothom Alo, sources.txt feeds)
│   ├── summarizers/     # Summarizer providers
│   ├── utils/           # logger, response envelope, geo datasets
│   ├── security.py      # JWT + role guards
│   └── main.py          # App factory
├── scripts/             # Standalone scraper prototypes (ffwc.py, met.py)
├── sources.txt          # Official feed URLs to ingest
├── main.py              # Entry point (uvicorn)
└── render.yaml          # Render deployment config
```

## API Endpoints

All prefixed with `/api/v1`. Standard response envelope: `{ "success": bool, "message": str, "data": ... }`.

### Auth
- `POST /auth/register` — register (role: Admin | LocalAuthority | Volunteer)
- `POST /auth/login` — login, returns JWT
- `GET /auth/me` — current user profile

### Public (no authentication)
- `GET /public/division-weather` — live met.no weather for all divisions
- `GET /public/district-weather` — stored district weather
- `GET /public/district-weather/index` — district list with coordinates
- `GET /public/district-weather/live?district=...` — live weather for one district
- `GET /public/weather-alerts` — active weather alerts

### Authority (LocalAuthority & Admin)
- `GET /authority/dashboard/overview` — dashboard metrics
- `GET|POST /authority/volunteers` — list / create volunteers
- `GET|POST /authority/tasks`, `PATCH /authority/tasks/{id}` — task management
- `GET /authority/members`, `GET /authority/unions` — community data
- `GET /authority/community-responses`, `PATCH /authority/community-responses/{id}`
- `POST /authority/alerts` — create alert; with a `message` field it **broadcasts SMS** to the authority's union members (sms.net.bd) and logs deliveries
- `POST /authority/alerts/simplify` — AI-simplified alert text (EN + BN)
- `GET /authority/weather-alerts` · `GET /authority/incidents` · `GET /authority/event-logs`
- `GET /authority/district-weather[/index|/live]` — weather views
- `GET|POST /authority/missing-persons`
- `GET /authority/geospatial-risk` — map payload (infra exposure + vulnerable communities + FFWC water-level station analytics + news hotspots)
- `GET|POST /authority/vulnerable-communities`
- `GET /authority/queries`, `POST /authority/queries/{id}/reply`

### Volunteer
- `GET /volunteer/dashboard` — stats, tasks, area alerts
- `GET /volunteer/tasks`, `PATCH /volunteer/tasks/{id}/complete`
- `POST /volunteer/coverage-updates`, `GET /volunteer/coverage-updates/latest` — GPS coverage
- `GET|POST /volunteer/community-status` — union-scoped member status
- `POST /volunteer/activity-logs` — household visits, rescues, relief (stored as event logs)
- `POST /volunteer/field-reports` — incident reports (stored as incidents)
- `POST /volunteer/infra-exposures`, `GET /volunteer/infra-exposures/latest`

### Ingestion
- `POST /ingestion/news/run` — crawl sources, summarize, run impact analysis
- `GET /ingestion/news/latest` · `GET /ingestion/news/processed/latest`
- `GET /ingestion/impact/latest` — latest impact snapshot
- `POST /ingestion/impact/run` — re-run AI impact analysis
- `POST /ingestion/geo/import` — import BD geo hierarchy (divisions → unions)

> Ingestion is **API-triggered** — the periodic background worker was removed for free-tier hosting limits. Trigger `POST /ingestion/news/run` manually or from an external scheduler (e.g. a cron ping).

## AI Pipeline

1. **Sources** (`app/sources/core.py`): Prothom Alo environment-section crawler (listing pages + sitemap fallback, disaster-keyword filter) and `sources.txt` official feeds — FFWC flood-summary PDFs (pypdf), UNOSAT ArcGIS endpoint discovery, BMD pages, met.no JSON.
2. **Orchestrator** (`app/services/ingestion_orchestrator.py`): SHA-256 dedup, summarization, BN→EN translation; persists to `intel_articles`, `news_articles_raw/processed`, and `official_feed_raw/analysis`.
3. **Summarization** (`app/services/llm_gateway.py`): Qwen via HF Router → Gemini → extractive heuristic, ordered by `AI_SUMMARIZER_PROVIDER` / `AI_SUMMARIZER_FALLBACKS`.
4. **Impact analysis**: the LLM aggregates recent processed items + the previous snapshot into a structured `impact_summary_snapshots` document (fatalities, missing, rescued, losses in BDT, danger level, priority actions, recovery needs — bilingual).

## SMS Broadcasts

`POST /authority/alerts` with `{ "message": "...", "simplifiedMessage": "..." }`:

1. Resolves the authority's assigned union and finds its community members.
2. Normalizes phone numbers to `880…` format and sends via sms.net.bd.
3. Persists the request to `community_alert_requests` and per-recipient results to `sms_dispatch_logs`.

Requires `SMSNETBD_ENABLED=True` and `SMSNETBD_API_KEY`. Use `SMSNETBD_FORCE_TO` to redirect all messages to one test number during development.

## Database

MongoDB (`disasterlens`) — see [MONGODB_SCHEMA.md](./MONGODB_SCHEMA.md) for collection schemas. Notable collections added after that document was written: `official_feed_raw`, `official_feed_analysis`, `event_logs`, `community_alert_requests`, `sms_dispatch_logs`. Geo indexes are created automatically by the geo import job.

## Deployment (Render)

[`render.yaml`](./render.yaml) defines the service (`rootDir: Backend`, `uvicorn app.main:app`). Set `MONGODB_URI`, `HF_TOKEN`, `GEMINI_API_KEY`, `SMSNETBD_API_KEY`, and `CORS_ALLOWED_ORIGINS` in the Render dashboard.

## Troubleshooting

- **Mongo connection fails** — check `MONGODB_URI`; for Atlas, whitelist your IP.
- **AI summaries look truncated/generic** — no `HF_TOKEN`/`GEMINI_API_KEY` configured; the heuristic fallback is active.
- **SMS returns 502** — `SMSNETBD_ENABLED` is off, the API key is missing/invalid, or members have no valid phone numbers.
- **Port already in use** — `lsof -ti:8000 | xargs kill -9` or set `PORT` in `.env`.
