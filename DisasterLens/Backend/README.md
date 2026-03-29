# DisasterLens Backend API

FastAPI-based backend service for the DisasterLens disaster management platform. Provides real-time disaster monitoring, news ingestion, AI-powered impact analysis, and volunteer coordination.

## Tech Stack

- **Framework**: FastAPI
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT (python-jose)
- **AI/LLM**: Google Gemini, LangChain
- **Web Scraping**: BeautifulSoup4, httpx
- **Translation**: deep-translator
- **Server**: Uvicorn

## Features

- 🔐 JWT-based authentication with role-based access control (Admin, LocalAuthority, Volunteer)
- 📰 Automated news ingestion from multiple sources (Prothom Alo, custom sources)
- 🤖 AI-powered news summarization and impact analysis using Google Gemini
- 🌍 Bangladesh geographic reference data (divisions, districts, upazilas, unions)
- 📊 Real-time disaster metrics and impact tracking
- 👥 Volunteer management and task assignment
- 🚨 Alert and incident reporting system
- 🗺️ Geospatial risk assessment with infrastructure exposure tracking
- 🔄 Background worker for periodic news ingestion
- 🌐 Bilingual support (English and Bengali)

## Prerequisites

- Python 3.10+
- MongoDB 4.4+ (local or MongoDB Atlas)
- Google Gemini API key (optional, for AI features)

## Installation

1. **Clone the repository**
```bash
cd DisasterLens/Backend
```

2. **Create virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `MONGODB_URI`: Your MongoDB connection string
- `SECRET_KEY`: Strong secret key for JWT tokens
- `GEMINI_API_KEY`: Your Google Gemini API key
- Other settings as needed

## Configuration

### Environment Variables

See `.env.example` for all available configuration options. Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `disasterlens` |
| `SECRET_KEY` | JWT secret key | (required) |
| `GEMINI_API_KEY` | Google Gemini API key | (optional) |
| `DEBUG` | Enable debug mode | `False` |
| `PORT` | Server port | `8000` |
| `ENABLE_INGESTION_WORKER` | Enable background news ingestion | `True` |
| `INGESTION_WORKER_INTERVAL_SECONDS` | Ingestion interval | `3600` |

### API Prefix

The API uses `/api` as the base prefix. All endpoints are accessible at:
```
http://localhost:8000/api/{endpoint}
```

## Running the Application

### Development Mode

```bash
python main.py
```

The server will start at `http://localhost:8000` with auto-reload enabled.

### Production Mode

```bash
# Set DEBUG=False in .env first
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## Database Schema

See [MONGODB_SCHEMA.md](./MONGODB_SCHEMA.md) for complete MongoDB collection schemas.

The application uses 27 collections including:
- User authentication and profiles
- Volunteer and task management
- News articles (raw, processed, intelligence)
- Weather alerts and incidents
- Geographic reference data
- Impact analysis snapshots
- Community response tracking

## Project Structure

```
Backend/
├── app/
│   ├── config/          # Application settings
│   ├── controllers/     # Business logic controllers
│   ├── db/              # Database connection
│   ├── jobs/            # Background jobs (geo import)
│   ├── models/          # Data models
│   ├── routes/          # API endpoints
│   │   ├── auth_routes.py
│   │   ├── authority_routes.py
│   │   ├── volunteer_routes.py
│   │   ├── ingestion_routes.py
│   │   └── ...
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic services
│   │   ├── auth_service.py
│   │   ├── ingestion_orchestrator.py
│   │   ├── summarization_service.py
│   │   ├── translation_service.py
│   │   └── ...
│   ├── sources/         # News source adapters
│   ├── summarizers/     # AI summarization providers
│   ├── utils/           # Utilities (logger, response)
│   ├── main.py          # FastAPI app factory
│   └── security.py      # JWT and auth utilities
├── main.py              # Application entry point
├── requirements.txt     # Python dependencies
├── .env.example         # Environment template
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Authority (Local Authority & Admin)
- `GET /api/authority/dashboard/overview` - Dashboard metrics
- `GET /api/authority/volunteers` - List volunteers
- `POST /api/authority/volunteers` - Create volunteer
- `GET /api/authority/tasks` - List tasks
- `POST /api/authority/tasks` - Create task
- `PATCH /api/authority/tasks/{id}` - Update task
- `GET /api/authority/weather-alerts` - Weather alerts
- `GET /api/authority/incidents` - Incident reports
- `GET /api/authority/missing-persons` - Missing persons
- `POST /api/authority/missing-persons` - Report missing person
- `GET /api/authority/geospatial-risk` - Geospatial risk data
- `GET /api/authority/vulnerable-communities` - Vulnerable communities
- `POST /api/authority/vulnerable-communities` - Add vulnerable community

### Volunteer
- `GET /api/volunteer/dashboard` - Volunteer dashboard
- `GET /api/volunteer/tasks` - Assigned tasks
- `POST /api/volunteer/coverage-updates` - Submit coverage update
- `POST /api/volunteer/infra-exposures` - Log infrastructure exposure

### Ingestion (News & Data)
- `POST /api/ingestion/news/run` - Trigger news ingestion
- `GET /api/ingestion/news/latest` - Get latest news
- `GET /api/ingestion/news/processed/latest` - Get processed news
- `GET /api/ingestion/impact/latest` - Get latest impact snapshot
- `POST /api/ingestion/impact/run` - Run AI impact analysis
- `POST /api/ingestion/geo/import` - Import geo reference data

### Health
- `GET /api/health` - Health check

## Authentication

The API uses JWT bearer token authentication. Include the token in requests:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/api/auth/me
```

### User Roles

- **Admin**: Full system access
- **LocalAuthority**: Manage volunteers, tasks, alerts, and view all data
- **Volunteer**: View assigned tasks, submit reports, log exposures

## Background Worker

The application includes a background worker that automatically:
- Ingests news from enabled sources
- Summarizes articles using AI
- Performs impact analysis
- Updates disaster metrics

Configure via environment variables:
```env
ENABLE_INGESTION_WORKER=True
INGESTION_WORKER_INTERVAL_SECONDS=3600  # Run every hour
```

## News Sources

### Supported Sources

1. **Prothom Alo** - Bangladesh news portal (environment section)
2. **Custom Sources** - URLs from `sources.txt` file

Enable/disable sources in `.env`:
```env
SOURCE_ENABLE_PROTHOM_ALO=True
SOURCE_ENABLE_DAILY_STAR=False
SOURCE_ENABLE_SOURCES_TXT=True
```

### Adding Custom Sources

Create `sources.txt` in the backend root with one URL per line:
```
https://example.com/disaster-news
https://another-source.com/alerts
```

## AI Features

### Summarization

Automatically summarizes news articles using:
- **Primary**: Google Gemini
- **Fallbacks**: Mistral, Qwen (configurable)

Configure in `.env`:
```env
AI_SUMMARIZER_PROVIDER=gemini
AI_SUMMARIZER_FALLBACKS=mistral,qwen
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### Impact Analysis

AI-powered impact analysis generates:
- Executive summaries (English & Bengali)
- Fatality and rescue statistics
- Damage assessments
- Priority actions
- Recovery needs
- Danger level classification

## Translation

Automatic Bengali ↔ English translation using `deep-translator` for:
- News summaries
- Alert messages
- User-generated content

## Development

### Seed Data

The application automatically seeds initial data on startup:
- Sample volunteers
- Sample tasks
- Weather alerts
- Community responses
- And more...

### Adding New Endpoints

1. Create route file in `app/routes/`
2. Define router with prefix and tags
3. Add route handlers with proper authentication
4. Register router in `app/main.py`

Example:
```python
from fastapi import APIRouter, Depends
from app.security import require_roles
from app.utils.response import APIResponse, success_response

router = APIRouter(prefix="/example", tags=["Example"])

@router.get("/data", response_model=APIResponse)
async def get_data(_: dict = Depends(require_roles("Admin"))) -> APIResponse:
    return success_response("Data retrieved", {"key": "value"})
```

### Database Indexes

Key indexes are automatically created for:
- `geo_districts`: district_id, division_id, name_lc
- `geo_upazilas`: upazila_id, district_id, name_lc
- `geo_unions`: union_id, upazila_id, name_lc
- `geo_divisions`: division_id, name_lc

## Testing

### Manual Testing

Use the Swagger UI at `/api/docs` for interactive testing.

### Example Requests

**Register User:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "role": "Volunteer",
    "assignedArea": "Dhaka"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

## Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB is running (local) or accessible (Atlas)
- Ensure IP whitelist is configured (Atlas)

### Gemini API Errors

- Verify `GEMINI_API_KEY` is valid
- Check API quota and rate limits
- Review logs for specific error messages

### Port Already in Use

```bash
# Change port in .env
PORT=8001

# Or kill existing process
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

## License

[Your License Here]

## Support

For issues and questions, please contact the development team or create an issue in the repository.
