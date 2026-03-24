import { AlertTriangle } from "lucide-react";
import { Card } from "./ui/card";
import { useLanguage } from "../i18n/LanguageContext";

interface SilentCommunity {
  villageName: string;
  villageNameBn: string;
  populationContacted: number;
  responsesReceived: number;
}

const silentCommunities: SilentCommunity[] = [
  { villageName: "Char Janajat", villageNameBn: "চর জনজাত", populationContacted: 450, responsesReceived: 23 },
  { villageName: "Uttar Para", villageNameBn: "উত্তর পাড়া", populationContacted: 320, responsesReceived: 15 },
];

export function SilentCommunityAlert() {
  const { t, d } = useLanguage();

  return (
    <Card className="border-l-4 border-l-orange-500 bg-orange-50">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-700" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{t("silentAlert.title")}</h3>
            <p className="text-sm text-gray-600">{t("silentAlert.subtitle")}</p>
          </div>
        </div>

        <div className="space-y-3">
          {silentCommunities.map((community, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-orange-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">{t("silentAlert.villageName")}</p>
                  <p className="font-semibold text-gray-900">{d(community.villageName, community.villageNameBn)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("silentAlert.populationContacted")}</p>
                  <p className="font-semibold text-gray-900">{community.populationContacted}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("silentAlert.responsesReceived")}</p>
                  <p className="font-semibold text-gray-900">{community.responsesReceived}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t("common.status")}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {t("status.silentCommunity")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
