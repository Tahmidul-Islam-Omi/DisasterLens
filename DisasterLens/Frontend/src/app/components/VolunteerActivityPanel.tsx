import { Users, ClipboardList, UserCheck } from "lucide-react";
import { Card } from "./ui/card";
import { useLanguage } from "../i18n/LanguageContext";

export function VolunteerActivityPanel() {
  const { t } = useLanguage();

  return (
    <Card>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">{t("volunteer.activity")}</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-700 mx-auto mb-2" />
            <p className="text-2xl font-semibold text-gray-900">32</p>
            <p className="text-sm text-gray-600">{t("volunteer.totalVolunteers")}</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <UserCheck className="w-8 h-8 text-green-700 mx-auto mb-2" />
            <p className="text-2xl font-semibold text-gray-900">24</p>
            <p className="text-sm text-gray-600">{t("volunteer.activeVolunteers")}</p>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <ClipboardList className="w-8 h-8 text-orange-700 mx-auto mb-2" />
            <p className="text-2xl font-semibold text-gray-900">18</p>
            <p className="text-sm text-gray-600">{t("volunteer.assignedTasks")}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
