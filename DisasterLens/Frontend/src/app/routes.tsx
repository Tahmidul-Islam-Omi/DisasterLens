import { createBrowserRouter } from "react-router";
import { DashboardView } from "./pages/DashboardView";
import { DistrictWeatherView } from "./pages/DistrictWeatherView";
import { QueriesView } from "./pages/QueriesView";
import { WeatherAlertsView } from "./pages/WeatherAlertsView";
import { CreateAlertView } from "./pages/CreateAlertView";
import { ImpactSummaryView } from "./pages/ImpactSummaryView";
import { IncidentLogsView } from "./pages/IncidentLogsView";
import { VolunteerCoverageView } from "./pages/VolunteerCoverageView";
import { MissingPersonsView } from "./pages/MissingPersonsView";
import { VolunteerDashboardView } from "./pages/VolunteerDashboardView";
import { LogActivityView } from "./pages/LogActivityView";
import { FieldReportView } from "./pages/FieldReportView";
import { CommunityStatusView } from "./pages/CommunityStatusView";
import { LoginView } from "./pages/LoginView";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ConditionalLayout } from "./components/ConditionalLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Outlet } from "react-router";
import { GeospatialRiskDashboardView } from "./pages/GeospatialRiskDashboardView";
import { CriticalInfrastructureExposureView } from "./pages/CriticalInfrastructureExposureView";
import { VulnerableCommunitiesView } from "./pages/VulnerableCommunitiesView";
import { RiskAssessmentPipelineView } from "./pages/RiskAssessmentPipelineView";
import { AddCoverageView } from "./pages/AddCoverageView";
import { RegisterAuthorityView } from "./pages/RegisterAuthorityView";
import { LocalAuthorityDashboardView } from "./pages/LocalAuthorityDashboardView";
import { VolunteerManagementView } from "./pages/VolunteerManagementView";
import { TaskManagementView } from "./pages/TaskManagementView";
import { MemberListView } from "./pages/MemberListView";
import { CommunityResponseListView } from "./pages/CommunityResponseListView";
import { LocalAuthorityAlertView } from "./pages/LocalAuthorityAlertView";

// Protected Layout component with Sidebar and Header
function ProtectedLayout() {
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

export const router = createBrowserRouter([
  // Login route (standalone, no layout)
  {
    path: "/login",
    Component: LoginView,
  },
  
  // Public routes with ConditionalLayout (shows sidebar when authenticated)
  {
    Component: ConditionalLayout,
    children: [
      {
        path: "/",
        Component: DashboardView,
      },
      {
        path: "/district-weather",
        Component: DistrictWeatherView,
      },
      {
        path: "/view-alert",
        Component: WeatherAlertsView,
      },
    ],
  },
  
  // Protected routes with ProtectedLayout
  {
    Component: ProtectedLayout,
    children: [
      // Volunteer routes
      {
        path: "/volunteer-dashboard",
        element: (
          <ProtectedRoute>
            <VolunteerDashboardView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/log-activity",
        element: (
          <ProtectedRoute>
            <LogActivityView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/field-report",
        element: (
          <ProtectedRoute>
            <FieldReportView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/add-coverage",
        element: (
          <ProtectedRoute>
            <AddCoverageView />
          </ProtectedRoute>
        ),
      },
      
      // Shared: Volunteer + LocalAuthority
      {
        path: "/community-status",
        element: (
          <ProtectedRoute>
            <CommunityStatusView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/missing-persons",
        element: (
          <ProtectedRoute>
            <MissingPersonsView />
          </ProtectedRoute>
        ),
      },
      
      // LocalAuthority routes
      {
        path: "/volunteer-coverage",
        element: (
          <ProtectedRoute>
            <VolunteerCoverageView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/local-authority-dashboard",
        element: (
          <ProtectedRoute>
            <LocalAuthorityDashboardView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/volunteer-management",
        element: (
          <ProtectedRoute>
            <VolunteerManagementView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/task-management",
        element: (
          <ProtectedRoute>
            <TaskManagementView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/member-list",
        element: (
          <ProtectedRoute>
            <MemberListView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/community-responses",
        element: (
          <ProtectedRoute>
            <CommunityResponseListView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/union-alerts",
        element: (
          <ProtectedRoute>
            <LocalAuthorityAlertView />
          </ProtectedRoute>
        ),
      },
      
      // Shared: LocalAuthority + Admin
      {
        path: "/create-alert",
        element: (
          <ProtectedRoute>
            <CreateAlertView />
          </ProtectedRoute>
        ),
      },
      
      // Admin routes
      {
        path: "/geospatial-risk",
        element: (
          <ProtectedRoute>
            <GeospatialRiskDashboardView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/infrastructure-exposure",
        element: (
          <ProtectedRoute>
            <CriticalInfrastructureExposureView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vulnerable-communities",
        element: (
          <ProtectedRoute>
            <VulnerableCommunitiesView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/risk-pipeline",
        element: (
          <ProtectedRoute>
            <RiskAssessmentPipelineView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register-authority",
        element: (
          <ProtectedRoute>
            <RegisterAuthorityView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/query",
        element: (
          <ProtectedRoute>
            <QueriesView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/impact-summary",
        element: (
          <ProtectedRoute>
            <ImpactSummaryView />
          </ProtectedRoute>
        ),
      },
      {
        path: "/incident-logs",
        element: (
          <ProtectedRoute>
            <IncidentLogsView />
          </ProtectedRoute>
        ),
      },
      
      // Fallback routes
      {
        path: "/history",
        element: (
          <ProtectedRoute>
            <div className="p-8">
              <h2 className="text-2xl font-bold">History</h2>
              <p className="text-gray-500 mt-2">History page coming soon</p>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <div className="p-8">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-gray-500 mt-2">Settings page coming soon</p>
            </div>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        Component: () => (
          <div className="p-8">
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
          </div>
        ),
      },
    ],
  },
]);