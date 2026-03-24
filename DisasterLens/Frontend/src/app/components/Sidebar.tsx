import { Home, AlertCircle, Users, ClipboardList, UserCircle, ListTodo } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useLanguage } from "../i18n/LanguageContext";

export function Sidebar() {
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t("nav.dashboard"), href: "/", icon: Home },
    { name: t("nav.broadcastAlert"), href: "/create-alert", icon: AlertCircle },
    { name: t("nav.communityStatus"), href: "/community-status", icon: Users },
    { name: t("nav.volunteerManagement"), href: "/volunteer-management", icon: ClipboardList },
    { name: t("nav.taskManagement"), href: "/task-management", icon: ListTodo },
    { name: t("nav.memberList"), href: "/member-list", icon: UserCircle },
  ];

  return (
    <div className="w-64 bg-blue-900 min-h-screen flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-800">
        <h2 className="text-white text-xl font-semibold">{t("nav.brandName")}</h2>
        <p className="text-blue-200 text-sm mt-1">{t("nav.brandSubtitle")}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-800 text-white"
                      : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800">
        <div className="text-blue-200 text-xs">
          <p>{t("nav.footerName")}</p>
          <p className="mt-1">{t("nav.lastUpdated")}</p>
        </div>
      </div>
    </div>
  );
}
