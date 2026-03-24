import { AlertTriangle, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { useLanguage } from "../i18n/LanguageContext";
import { alertTimelineData } from "../data/mockData";

export function AlertTimeline() {
  const { t, d } = useLanguage();

  return (
    <Card>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">{t("alertTimeline.title")}</h3>

        <div className="space-y-3">
          {alertTimelineData.map((alert, index) => (
            <div key={index} className="border-l-4 border-l-orange-500 bg-orange-50 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg mt-1">
                  <AlertTriangle className="w-5 h-5 text-orange-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{d(alert.headline, alert.headlineBn)}</h4>
                  <p className="text-sm text-gray-700 mb-2">{d(alert.description, alert.descriptionBn)}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{t("common.published")}: {d(alert.timestamp, alert.timestampBn)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
