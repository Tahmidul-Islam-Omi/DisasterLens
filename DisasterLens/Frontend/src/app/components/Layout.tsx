import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { useLanguage } from "../i18n/LanguageContext";
import { Globe } from "lucide-react";

export function Layout() {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 relative">
        {/* Language Toggle Button - Top Right */}
        <div className="fixed top-4 right-6 z-50">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg border border-gray-200 bg-white transition-all hover:shadow-xl"
          >
            <Globe className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-medium text-blue-900">
              {lang === "en" ? "বাংলা" : "English"}
            </span>
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
