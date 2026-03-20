import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole } from "./context/RoleContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";

import Dashboard from "./pages/dashboards/DashboardView";
import DistrictWeatherView from "./pages/weather/DistrictWeatherView";
import QueriesView from "./pages/authorities/QueriesView";
import WeatherAlertsView from "./pages/weather/WeatherAlertsView";
import CreateAlertView from "./pages/weather/CreateAlertView";
import ImpactSummaryView from "./pages/disasters/ImpactSummaryView";
import IncidentLogsView from "./pages/disasters/IncidentLogsView";
import VolunteerCoverageView from "./pages/volunteer/VolunteerCoverageView";
import MissingPersonsView from "./pages/volunteer/MissingPersonsView";
import VolunteerDashboardView from "./pages/volunteer/VolunteerDashboardView";
import LogActivityView from "./pages/volunteer/LogActivityView";
import FieldReportView from "./pages/volunteer/FieldReportView";
import CommunityStatusView from "./pages/volunteer/CommunityStatusView";
import GeospatialRiskDashboardView from "./pages/dashboards/GeospatialRiskDashboardView";
import CriticalInfrastructureExposureView from "./pages/disasters/CriticalInfrastructureExposureView";
import VulnerableCommunitiesView from "./pages/disasters/VulnerableCommunitiesView";
import RiskAssessmentPipelineView from "./pages/dashboards/RiskAssessmentPipelineView";
import DisasterDetailsView from "./pages/disasters/DisasterDetailsView";
import AddCoverageView from "./pages/volunteer/AddCoverageView";
import RegisterAuthorityView from "./pages/authorities/RegisterAuthorityView";

function Layout() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8FAFC" }}>
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

function RoleBasedIndex() {
  const { role } = useRole();
  if (role === "Volunteer") return <Navigate to="/volunteer-dashboard" replace />;
  if (role === "Coordinator") return <Navigate to="/impact-summary" replace />;
  return <Dashboard />;
}

function HistoryPage() {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">{t("history_title")}</h2>
      <p className="text-gray-500 mt-2">{t("history_desc")}</p>
    </div>
  );
}

function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">{t("settings_title")}</h2>
      <p className="text-gray-500 mt-2">{t("settings_desc")}</p>
    </div>
  );
}

function NotFoundPage() {
  const { t } = useTranslation();
  return <div className="p-8">{t("page_not_found")}</div>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: RoleBasedIndex },
      { path: "district-weather", Component: DistrictWeatherView },
      { path: "query", Component: QueriesView },
      { path: "create-alert", Component: CreateAlertView },
      { path: "view-alert", Component: WeatherAlertsView },
      { path: "impact-summary", Component: ImpactSummaryView },
      { path: "incident-logs", Component: IncidentLogsView },
      { path: "volunteer-coverage", Component: VolunteerCoverageView },
      { path: "missing-persons", Component: MissingPersonsView },
      { path: "volunteer-dashboard", Component: VolunteerDashboardView },
      { path: "log-activity", Component: LogActivityView },
      { path: "field-report", Component: FieldReportView },
      { path: "community-status", Component: CommunityStatusView },
      { path: "geospatial-risk", Component: GeospatialRiskDashboardView },
      { path: "infrastructure-exposure", Component: CriticalInfrastructureExposureView },
      { path: "vulnerable-communities", Component: VulnerableCommunitiesView },
      { path: "risk-pipeline", Component: RiskAssessmentPipelineView },
      { path: "disaster-details", Component: DisasterDetailsView },
      { path: "add-coverage", Component: AddCoverageView },
      { path: "register-authority", Component: RegisterAuthorityView },
      { path: "history", Component: HistoryPage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage }
    ]
  }
]);
