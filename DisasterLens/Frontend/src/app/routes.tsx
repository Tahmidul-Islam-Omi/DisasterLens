import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { CreateAlert } from "./pages/CreateAlert";
import { CommunityStatus } from "./pages/CommunityStatus";
import { VolunteerManagement } from "./pages/VolunteerManagement";
import { TaskManagement } from "./pages/TaskManagement";
import { MemberList } from "./pages/MemberList";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "create-alert", Component: CreateAlert },
      { path: "community-status", Component: CommunityStatus },
      { path: "volunteer-management", Component: VolunteerManagement },
      { path: "task-management", Component: TaskManagement },
      { path: "member-list", Component: MemberList },
    ],
  },
]);