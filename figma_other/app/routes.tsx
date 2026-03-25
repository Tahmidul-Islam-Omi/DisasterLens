import { createBrowserRouter } from "react-router";
import { DashboardView } from "./components/DashboardView";
import { DistrictWeatherView } from "./components/DistrictWeatherView";
import { QueriesView } from "./components/QueriesView";
import { WeatherAlertsView } from "./components/WeatherAlertsView";
import { CreateAlertView } from "./components/CreateAlertView";
import { ImpactSummaryView } from "./components/ImpactSummaryView";
import { IncidentLogsView } from "./components/IncidentLogsView";
import { VolunteerCoverageView } from "./components/VolunteerCoverageView";
import { MissingPersonsView } from "./components/MissingPersonsView";
import { VolunteerDashboardView } from "./components/VolunteerDashboardView";
import { LogActivityView } from "./components/LogActivityView";
import { FieldReportView } from "./components/FieldReportView";
import { CommunityStatusView } from "./components/CommunityStatusView";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Outlet, Navigate } from "react-router";
import { useRole } from "./contexts/RoleContext";
import { GeospatialRiskDashboardView } from "./components/GeospatialRiskDashboardView";
import { CriticalInfrastructureExposureView } from "./components/CriticalInfrastructureExposureView";
import { VulnerableCommunitiesView } from "./components/VulnerableCommunitiesView";
import { RiskAssessmentPipelineView } from "./components/RiskAssessmentPipelineView";
import { DisasterDetailsView } from "./components/DisasterDetailsView";
import { AddCoverageView } from "./components/AddCoverageView";
import { RegisterAuthorityView } from "./components/RegisterAuthorityView";

// Layout component to wrap all routes
function Layout() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto flex flex-col relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Redirect Component based on role
function RoleBasedIndex() {
  const { role } = useRole();
  if (role === 'Volunteer') return <Navigate to="/volunteer-dashboard" replace />;
  if (role === 'Coordinator') return <Navigate to="/impact-summary" replace />;
  return <DashboardView />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: RoleBasedIndex,
      },
      {
        path: "district-weather",
        Component: DistrictWeatherView,
      },
      {
        path: "query",
        Component: QueriesView,
      },
      {
        path: "create-alert",
        Component: CreateAlertView,
      },
      {
        path: "view-alert",
        Component: WeatherAlertsView,
      },
      {
        path: "impact-summary",
        Component: ImpactSummaryView,
      },
      {
        path: "incident-logs",
        Component: IncidentLogsView,
      },
      {
        path: "volunteer-coverage",
        Component: VolunteerCoverageView,
      },
      {
        path: "missing-persons",
        Component: MissingPersonsView,
      },
      {
        path: "volunteer-dashboard",
        Component: VolunteerDashboardView,
      },
      {
        path: "log-activity",
        Component: LogActivityView,
      },
      {
        path: "field-report",
        Component: FieldReportView,
      },
      {
        path: "community-status",
        Component: CommunityStatusView,
      },
      {
        path: "geospatial-risk",
        Component: GeospatialRiskDashboardView,
      },
      {
        path: "infrastructure-exposure",
        Component: CriticalInfrastructureExposureView,
      },
      {
        path: "vulnerable-communities",
        Component: VulnerableCommunitiesView,
      },
      {
        path: "risk-pipeline",
        Component: RiskAssessmentPipelineView,
      },
      {
        path: "disaster-details",
        Component: DisasterDetailsView,
      },
      {
        path: "add-coverage",
        Component: AddCoverageView,
      },
      {
        path: "register-authority",
        Component: RegisterAuthorityView,
      },
      {
        path: "history",
        Component: () => {
          const { t } = require('react-i18next').useTranslation();
          return <div className="p-8"><h2 className="text-2xl font-bold">{t('history_title')}</h2><p className="text-gray-500 mt-2">{t('history_desc')}</p></div>;
        },
      },
      {
        path: "settings",
        Component: () => {
          const { t } = require('react-i18next').useTranslation();
          return <div className="p-8"><h2 className="text-2xl font-bold">{t('settings_title')}</h2><p className="text-gray-500 mt-2">{t('settings_desc')}</p></div>;
        },
      },
      {
        path: "*",
        Component: () => {
          const { t } = require('react-i18next').useTranslation();
          return <div className="p-8">{t('page_not_found')}</div>;
        },
      },
    ],
  },
]);