import { Users, ShieldCheck, AlertCircle, Siren, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusCard } from "../components/StatusCard";
import { SilentCommunityAlert } from "../components/SilentCommunityAlert";
import { VillageStatusTable } from "../components/VillageStatusTable";
import { VolunteerActivityPanel } from "../components/VolunteerActivityPanel";
import { AlertTimeline } from "../components/AlertTimeline";
import { RecentTasks } from "../components/RecentTasks";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

type AuthorityOverview = {
  totalCommunityMembers: number;
  reportedSafe: number;
  needHelp: number;
  needRescue: number;
  noResponse: number;
};

export function LocalAuthorityDashboardView() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [overview, setOverview] = useState<AuthorityOverview>({
    totalCommunityMembers: 0,
    reportedSafe: 0,
    needHelp: 0,
    needRescue: 0,
    noResponse: 0,
  });

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await api.get<AuthorityOverview>("/authority/dashboard/overview", token);
        setOverview(data);
      } catch (error) {
        console.error("Failed to load authority overview", error);
      }
    };
    void loadOverview();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold">{t("dashboard.title")}</h1>
          <p className="text-blue-200 mt-1">{t("dashboard.subtitle")}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Community Status Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t("dashboard.communityOverview")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatusCard title={t("dashboard.totalCommunityMembers")} value={overview.totalCommunityMembers} icon={Users} variant="default" />
            <StatusCard title={t("status.reportedSafe")} value={overview.reportedSafe} icon={ShieldCheck} variant="success" />
            <StatusCard title={t("status.needHelp")} value={overview.needHelp} icon={AlertCircle} variant="warning" />
            <StatusCard title={t("status.needRescue")} value={overview.needRescue} icon={Siren} variant="danger" />
            <StatusCard title={t("status.noResponse")} value={overview.noResponse} icon={UserX} variant="default" />
          </div>
        </section>

        {/* Silent Communities Alert */}
        <section className="mb-8">
          <SilentCommunityAlert />
        </section>

        {/* Village Status */}
        <section className="mb-8">
          <VillageStatusTable />
        </section>

        {/* Volunteer Activity */}
        <section className="mb-8">
          <VolunteerActivityPanel />
        </section>

        {/* Union Dashboard Alerts */}
        <section className="mb-8">
          <AlertTimeline />
        </section>

        {/* Recent Tasks */}
        <section className="mb-8">
          <RecentTasks />
        </section>
      </main>
    </div>
  );
}
