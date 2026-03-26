# DisasterLens

AI-powered disaster management platform for real-time monitoring, volunteer coordination, and emergency response in Bangladesh. Features automated news ingestion, AI-driven impact analysis, geospatial risk mapping, and bilingual support (English & Bengali).

## Overview

DisasterLens is a comprehensive disaster management system designed to help authorities, volunteers, and communities respond effectively to natural disasters. The platform combines real-time data ingestion, AI-powered analysis, and intuitive interfaces to provide actionable insights during emergencies.

### Key Features

- 🤖 **AI-Powered Analysis**: Automated news summarization and impact assessment using Google Gemini
- 🗺️ **Geospatial Risk Mapping**: Interactive maps showing infrastructure exposure and vulnerable communities
- 📰 **Automated News Ingestion**: Real-time monitoring of disaster-related news from multiple sources
- 👥 **Volunteer Coordination**: Task assignment, coverage tracking, and field reporting
- 🚨 **Alert System**: Multi-level alerts for weather, incidents, and emergencies
- 🌐 **Bilingual Support**: Full English and Bengali (বাংলা) interface
- 📊 **Real-time Dashboards**: Role-based dashboards for Admin, Local Authority, and Volunteers
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🔐 **Role-Based Access**: Secure authentication with granular permissions

## Architecture

```
DisasterLens/
├── Backend/          # FastAPI backend service
│   ├── app/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic
│   │   ├── models/       # Data models
│   │   └── ...
│   └── README.md
│
├── Frontend/         # React web application
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/        # Page components
│   │   │   ├── components/   # UI components
│   │   │   ├── contexts/     # State management
│   │   │   └── ...
│   └── README.md
│
└── README.md         # This file
```

### Tech Stack

**Backend:**
- FastAPI (Python)
- MongoDB (Motor async driver)
- Google Gemini AI
- JWT Authentication
- BeautifulSoup4 (Web scraping)

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Radix UI / shadcn/ui
- Leaflet Maps
- React Router 7
- i18next (Internationalization)

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB 4.4+ (local or Atlas)
- Google Gemini API key (optional, for AI features)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd DisasterLens
```

### 2. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, SECRET_KEY, and GEMINI_API_KEY

# Run the backend
python main.py
```

Backend will start at `http://localhost:8000`

**API Documentation:** http://localhost:8000/api/docs

### 3. Frontend Setup

Open a new terminal window:

```bash
cd Frontend

# Install dependencies
npm install

# Configure environment
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:8000/api
# VITE_APP_NAME=DisasterLens

# Run the frontend
npm run dev
```

Frontend will start at `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/api/docs

**Default Login:**
- Register a new account at `/login` (Sign Up tab)
- Choose role: Admin, LocalAuthority, or Volunteer

## User Roles

### Admin
- Full system access
- Geospatial risk management
- Infrastructure exposure tracking
- Vulnerable communities management
- Impact analysis and AI pipeline
- System configuration

### Local Authority
- Volunteer management
- Task assignment and tracking
- Alert creation and broadcasting
- Community response monitoring
- Member database management
- Incident reporting

### Volunteer
- View assigned tasks
- Submit field reports
- Log activities and coverage
- Report infrastructure exposure
- Missing persons reporting
- Community status updates

## Core Features

### 1. AI-Powered News Ingestion

Automatically monitors and processes disaster-related news:
- Scrapes news from Prothom Alo and custom sources
- AI summarization in Bengali and English
- Automatic translation
- Deduplication and fingerprinting
- Hazard tagging (flood, cyclone, landslide, etc.)

### 2. Impact Analysis

AI-generated impact summaries provide:
- Executive summaries (bilingual)
- Fatality and rescue statistics
- Damage assessments and estimated losses
- Affected areas count
- Priority actions
- Recovery needs
- Danger level classification

### 3. Geospatial Risk Dashboard

Interactive map visualization showing:
- Infrastructure exposure points
- Vulnerable communities
- News-derived hotspots
- Risk severity indicators
- Population impact estimates

### 4. Volunteer Management

Comprehensive volunteer coordination:
- Task assignment with priorities
- Coverage area tracking with GPS
- Field report submission
- Activity logging
- Performance metrics

### 5. Alert System

Multi-level alert broadcasting:
- Weather alerts
- Authority alerts
- Incident notifications
- Timeline tracking
- Severity classification

### 6. Community Response Tracking

Monitor community status:
- Safe / Need Help / Need Rescue / No Response
- Village-level statistics
- Silent community identification
- Member database

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Authority
- `GET /api/authority/dashboard/overview` - Dashboard metrics
- `GET /api/authority/volunteers` - List volunteers
- `POST /api/authority/tasks` - Create task
- `GET /api/authority/geospatial-risk` - Geospatial data
- `POST /api/authority/missing-persons` - Report missing person

### Volunteer
- `GET /api/volunteer/dashboard` - Volunteer dashboard
- `POST /api/volunteer/coverage-updates` - Submit coverage
- `POST /api/volunteer/infra-exposures` - Log infrastructure

### Ingestion
- `POST /api/ingestion/news/run` - Trigger news ingestion
- `GET /api/ingestion/impact/latest` - Get impact snapshot
- `POST /api/ingestion/impact/run` - Run AI analysis

See [Backend README](./Backend/README.md) for complete API documentation.

## Database Schema

The application uses MongoDB with 27 collections including:

**Core Collections:**
- `users` - User authentication and profiles
- `volunteers` - Volunteer information
- `tasks` - Task assignments
- `members` - Community members
- `community_responses` - Status responses

**News & Intelligence:**
- `news_articles_raw` - Raw scraped articles
- `news_articles_processed` - Processed and summarized
- `intel_articles` - Intelligence feed
- `impact_summary_snapshots` - AI-generated summaries

**Geographic Data:**
- `geo_divisions` - Bangladesh divisions
- `geo_districts` - Districts
- `geo_upazilas` - Sub-districts
- `geo_unions` - Unions

**Alerts & Incidents:**
- `weather_alerts` - Weather warnings
- `authority_alerts` - Authority notifications
- `incidents` - Incident reports
- `missing_persons` - Missing persons database

See [MONGODB_SCHEMA.md](./Backend/MONGODB_SCHEMA.md) for complete schema documentation.

## Configuration

### Backend Environment Variables

Key variables in `Backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=disasterlens

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=60

# AI
GEMINI_API_KEY=your-gemini-api-key
AI_SUMMARIZER_PROVIDER=gemini

# News Sources
SOURCE_ENABLE_PROTHOM_ALO=True
SOURCE_ENABLE_SOURCES_TXT=True

# Worker
ENABLE_INGESTION_WORKER=True
INGESTION_WORKER_INTERVAL_SECONDS=3600
```

### Frontend Environment Variables

Key variables in `Frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=DisasterLens
```

## Development

### Backend Development

```bash
cd Backend
python main.py  # Auto-reload enabled in DEBUG mode
```

- API docs: http://localhost:8000/api/docs
- Add routes in `app/routes/`
- Add services in `app/services/`
- Database seeding happens automatically on startup

### Frontend Development

```bash
cd Frontend
npm run dev  # Hot module replacement enabled
```

- Add pages in `src/app/pages/`
- Add components in `src/app/components/`
- Add routes in `src/app/routes.tsx`
- Translations in `src/app/i18n/translations.ts`

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Verify `MONGODB_URI` is correct
- Check MongoDB is running
- Verify network access (Atlas IP whitelist)

**Gemini API Errors:**
- Verify `GEMINI_API_KEY` is valid
- Check API quota limits
- Review error logs

### Frontend Issues

**API Connection Failed:**
- Verify backend is running
- Check `VITE_API_BASE_URL` is correct
- Verify CORS configuration

**Build Errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Common Issues

**Port Already in Use:**
```bash
# Change port in backend .env
PORT=8001

# Or kill existing process
lsof -ti:8000 | xargs kill -9  # Linux/Mac
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Documentation

- [Backend README](./Backend/README.md) - Backend API documentation
- [Frontend README](./Frontend/README.md) - Frontend development guide
- [MongoDB Schema](./Backend/MONGODB_SCHEMA.md) - Database schema reference

## License

[Your License Here]

## Support

For issues, questions, or contributions:
- Create an issue in the repository
- Contact the development team
- Check documentation in Backend and Frontend READMEs

## Acknowledgments

- Google Gemini for AI capabilities
- OpenStreetMap for map tiles
- Bangladesh Geo API for geographic data
- Prothom Alo for news content

---

**Built with ❤️ for disaster resilience in Bangladesh**
