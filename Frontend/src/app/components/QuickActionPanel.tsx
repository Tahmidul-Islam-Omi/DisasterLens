import { AlertCircle, MessageSquare, UserPlus } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useLanguage } from "../i18n/LanguageContext";

export function QuickActionPanel() {
  const { t } = useLanguage();

  return (
    <Card className="bg-gradient-to-br from-blue-900 to-blue-800">
      <div className="p-6">
        <h3 className="font-semibold text-lg text-white mb-4">{t("quickAction.title")}</h3>

        <div className="grid grid-cols-1 gap-3">
          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 justify-start h-auto py-4">
            <AlertCircle className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">{t("quickAction.createAlert")}</div>
              <div className="text-xs text-gray-600">{t("quickAction.createAlertDesc")}</div>
            </div>
          </Button>

          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 justify-start h-auto py-4">
            <MessageSquare className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">{t("quickAction.viewResponses")}</div>
              <div className="text-xs text-gray-600">{t("quickAction.viewResponsesDesc")}</div>
            </div>
          </Button>

          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 justify-start h-auto py-4">
            <UserPlus className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-semibold">{t("quickAction.assignVolunteer")}</div>
              <div className="text-xs text-gray-600">{t("quickAction.assignVolunteerDesc")}</div>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
}
