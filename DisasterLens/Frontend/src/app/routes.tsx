import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CreateAlert } from "./pages/CreateAlert";
import { CommunityStatus } from "./pages/CommunityStatus";
import { VolunteerManagement } from "./pages/VolunteerManagement";
import { TaskManagement } from "./pages/TaskManagement";
import { MemberList } from "./pages/MemberList";

// Weather pages
import WeatherDashboardView from "./pages/dashboards/WeatherDashboardView";
import WeatherAlertsView from "./pages/weather/WeatherAlertsView";
import DistrictWeatherView from "./pages/weather/DistrictWeatherView";
import CreateAlertView from "./pages/weather/CreateAlertView";

// Disaster pages
import ImpactSummaryView from "./pages/disasters/ImpactSummaryView";
import IncidentLogsView from "./pages/disasters/IncidentLogsView";
import VulnerableCommunitiesView from "./pages/disasters/VulnerableCommunitiesView";
import DisasterDetailsView from "./pages/disasters/DisasterDetailsView";
import CriticalInfrastructureExposureView from "./pages/disasters/CriticalInfrastructureExposureView";

// Volunteer pages
import AddCoverageView from "./pages/volunteer/AddCoverageView";
import FieldReportView from "./pages/volunteer/FieldReportView";
import LogActivityView from "./pages/volunteer/LogActivityView";
import VolunteerCoverageView from "./pages/volunteer/VolunteerCoverageView";
import CommunityStatusView from "./pages/volunteer/CommunityStatusView";
import MissingPersonsView from "./pages/volunteer/MissingPersonsView";
import VolunteerDashboardView from "./pages/volunteer/VolunteerDashboardView";

// Authority pages
import QueriesView from "./pages/authorities/QueriesView";
import RegisterAuthorityView from "./pages/authorities/RegisterAuthorityView";

// Dashboard pages
import GeospatialRiskDashboardView from "./pages/dashboards/GeospatialRiskDashboardView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      // Original pages
      { index: true, Component: Dashboard },
      { path: "create-alert", Component: CreateAlert },
      { path: "community-status", Component: CommunityStatus },
      { path: "volunteer-management", Component: VolunteerManagement },
      { path: "task-management", Component: TaskManagement },
      { path: "member-list", Component: MemberList },

      // Weather
      { path: "weather-dashboard", Component: WeatherDashboardView },
      { path: "weather-alerts", Component: WeatherAlertsView },
      { path: "district-weather", Component: DistrictWeatherView },
      { path: "create-weather-alert", Component: CreateAlertView },

      // Disasters
      { path: "impact-summary", Component: ImpactSummaryView },
      { path: "incident-logs", Component: IncidentLogsView },
      { path: "vulnerable-communities", Component: VulnerableCommunitiesView },
      { path: "disaster-details", Component: DisasterDetailsView },
      { path: "critical-infrastructure", Component: CriticalInfrastructureExposureView },

      // Volunteers
      { path: "volunteer-dashboard", Component: VolunteerDashboardView },
      { path: "add-coverage", Component: AddCoverageView },
      { path: "field-report", Component: FieldReportView },
      { path: "log-activity", Component: LogActivityView },
      { path: "volunteer-coverage", Component: VolunteerCoverageView },
      { path: "community-status-update", Component: CommunityStatusView },
      { path: "missing-persons", Component: MissingPersonsView },

      // Authorities
      { path: "queries", Component: QueriesView },
      { path: "register-authority", Component: RegisterAuthorityView },

      // Dashboards
      { path: "geospatial-risk", Component: GeospatialRiskDashboardView },
    ],
  },
]);