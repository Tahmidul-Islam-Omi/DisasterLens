# DisasterLens Frontend

React-based web application for the DisasterLens disaster management platform. Provides real-time disaster monitoring, volunteer coordination, and emergency response management with bilingual support (English & Bengali).

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 6.4
- **Language**: TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI, shadcn/ui
- **Maps**: Leaflet, React Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React, Material UI Icons
- **Internationalization**: i18next, react-i18next
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Notifications**: Sonner

## Features

- 🔐 JWT-based authentication with role-based access (Admin, LocalAuthority, Volunteer)
- 🌍 Interactive geospatial risk dashboard with Leaflet maps
- 📊 Real-time disaster metrics and impact visualization
- 🚨 Weather alerts and incident tracking
- 👥 Volunteer management and task assignment
- 📱 Responsive design for mobile and desktop
- 🌐 Bilingual interface (English & Bengali)
- 🗺️ Infrastructure exposure mapping
- 📈 Impact analysis and reporting
- 🔔 Real-time notifications
- 🎨 Modern UI with Radix UI components
- 🌙 Theme support (light/dark mode ready)

## Prerequisites

- Node.js 18+
- npm, pnpm, or yarn
- Backend API running (see [Backend README](../Backend/README.md))

## Installation

1. **Navigate to frontend directory**
```bash
cd DisasterLens/Frontend
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the frontend root:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=DisasterLens
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start at `http://localhost:5173` with hot module replacement.

### Production Build

```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Frontend/
├── src/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ...
│   │   ├── contexts/        # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   ├── RoleContext.tsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── DashboardView.tsx
│   │   │   ├── LoginView.tsx
│   │   │   ├── VolunteerDashboardView.tsx
│   │   │   ├── LocalAuthorityDashboardView.tsx
│   │   │   └── ...
│   │   ├── i18n/            # Internationalization
│   │   │   ├── LanguageContext.tsx
│   │   │   └── translations.ts
│   │   ├── lib/             # Utilities and helpers
│   │   │   ├── api.ts       # API client
│   │   │   └── utils.ts
│   │   ├── types/           # TypeScript type definitions
│   │   ├── config/          # Configuration files
│   │   ├── data/            # Static data
│   │   ├── App.tsx          # Root component
│   │   └── routes.tsx       # Route definitions
│   ├── styles/              # Global styles
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite type definitions
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── postcss.config.mjs       # PostCSS configuration
└── README.md
```

## Pages & Routes

### Public Routes
- `/` - Public dashboard with disaster overview
- `/login` - User authentication
- `/district-weather` - District weather information
- `/disaster-details` - Detailed disaster information
- `/view-alert` - Weather alerts

### Volunteer Routes
- `/volunteer-dashboard` - Volunteer dashboard
- `/log-activity` - Log volunteer activities
- `/field-report` - Submit field reports
- `/add-coverage` - Add coverage updates
- `/community-status` - Community status tracking
- `/missing-persons` - Missing persons reports

### Local Authority Routes
- `/local-authority-dashboard` - Authority dashboard
- `/volunteer-management` - Manage volunteers
- `/task-management` - Manage tasks
- `/volunteer-coverage` - View volunteer coverage
- `/member-list` - Community member list
- `/community-responses` - Community response tracking
- `/union-alerts` - Create and manage alerts

### Admin Routes
- `/geospatial-risk` - Geospatial risk dashboard with maps
- `/infrastructure-exposure` - Infrastructure exposure tracking
- `/vulnerable-communities` - Vulnerable communities management
- `/risk-pipeline` - Risk assessment pipeline
- `/impact-summary` - AI-generated impact summaries
- `/incident-logs` - Incident logging and tracking
- `/query` - Query management
- `/register-authority` - Register new authorities

## Key Components

### Authentication
- `AuthContext` - Manages authentication state and JWT tokens
- `RoleContext` - Manages user roles and permissions
- `ProtectedRoute` - Route guard for authenticated pages

### Layout
- `Header` - Top navigation bar with user menu and language switcher
- `Sidebar` - Side navigation with role-based menu items
- `ConditionalLayout` - Shows sidebar when authenticated

### UI Components
Located in `src/app/components/ui/`:
- Buttons, Cards, Dialogs, Dropdowns
- Forms, Inputs, Selects
- Tables, Tabs, Tooltips
- Charts, Progress bars
- And more...

### Maps
- `GeospatialRiskDashboardView` - Interactive Leaflet map with risk markers
- Infrastructure exposure visualization
- Vulnerable community mapping

## API Integration

The frontend communicates with the backend API through `src/app/lib/api.ts`:

```typescript
import { apiRequest } from '@/app/lib/api';

// Example: Fetch data
const response = await apiRequest('/auth/me');

// Example: POST request
const result = await apiRequest('/tasks', {
  method: 'POST',
  body: JSON.stringify(taskData)
});
```

### API Configuration

Set the backend URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

The API client automatically:
- Adds JWT token to requests
- Handles authentication errors
- Provides standardized error handling
- Supports all HTTP methods

## Internationalization (i18n)

The app supports English and Bengali languages.

### Using Translations

```typescript
import { useLanguage } from '@/app/i18n/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <button onClick={() => setLanguage('bn')}>বাংলা</button>
    </div>
  );
}
```

### Adding Translations

Edit `src/app/i18n/translations.ts`:
```typescript
export const translations = {
  en: {
    dashboard: {
      title: 'Dashboard'
    }
  },
  bn: {
    dashboard: {
      title: 'ড্যাশবোর্ড'
    }
  }
};
```

## Styling

### Tailwind CSS

The project uses Tailwind CSS 4.1 for styling:

```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
</div>
```

### Custom Styles

Global styles are in `src/styles/`:
- `index.css` - Main stylesheet
- `tailwind.css` - Tailwind directives
- `theme.css` - Theme variables
- `fonts.css` - Font definitions

### Theme Variables

CSS variables for theming are defined in `theme.css`:
```css
:root {
  --primary: #2563eb;
  --secondary: #64748b;
  --accent: #f59e0b;
  /* ... */
}
```

## User Roles & Permissions

### Admin
- Full system access
- Geospatial risk management
- Infrastructure exposure tracking
- Vulnerable communities management
- Impact analysis and reporting

### LocalAuthority
- Volunteer management
- Task assignment and tracking
- Alert creation
- Community response monitoring
- Member management

### Volunteer
- View assigned tasks
- Submit field reports
- Log activities
- Add coverage updates
- Report missing persons

## Development Guidelines

### Adding a New Page

1. Create page component in `src/app/pages/`:
```tsx
// MyNewPage.tsx
export function MyNewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My New Page</h1>
    </div>
  );
}
```

2. Add route in `src/app/routes.tsx`:
```tsx
{
  path: "/my-new-page",
  element: (
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  ),
}
```

3. Add navigation link in `Sidebar.tsx` if needed.

### Creating UI Components

Use shadcn/ui components from `src/app/components/ui/`:

```tsx
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

function MyComponent() {
  return (
    <Card>
      <Button variant="primary">Click Me</Button>
    </Card>
  );
}
```

### State Management

Use React Context for global state:

```tsx
// Create context
const MyContext = createContext();

// Provider
export function MyProvider({ children }) {
  const [state, setState] = useState();
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
}

// Use in components
const { state, setState } = useContext(MyContext);
```

## Maps Integration

### Using Leaflet Maps

```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MyMap() {
  return (
    <MapContainer center={[23.8103, 90.4125]} zoom={7}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[23.8103, 90.4125]}>
        <Popup>Dhaka, Bangladesh</Popup>
      </Marker>
    </MapContainer>
  );
}
```

## Charts & Visualization

### Using Recharts

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function MyChart({ data }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#2563eb" />
    </LineChart>
  );
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application name | `DisasterLens` |

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Building for Production

1. **Build the application**
```bash
npm run build
```

2. **Test production build locally**
```bash
npm run preview
```

The build output will be in the `dist/` directory.

## Troubleshooting

### API Connection Issues

- Verify backend is running at `VITE_API_BASE_URL`
- Check CORS configuration on backend
- Inspect browser console for errors
- Verify JWT token is being sent in requests

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### Map Not Displaying

- Ensure Leaflet CSS is imported: `import 'leaflet/dist/leaflet.css'`
- Check map container has explicit height
- Verify coordinates are valid

### TypeScript Errors

```bash
# Check TypeScript configuration
npx tsc --noEmit
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Lazy loading for maps and charts
- Memoization with React.memo()
- Virtual scrolling for large lists

## License

[Your License Here]

## Support

For issues and questions, please contact the development team or create an issue in the repository.
