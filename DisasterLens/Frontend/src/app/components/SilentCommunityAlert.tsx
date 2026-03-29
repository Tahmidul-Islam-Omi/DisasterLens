import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card } from "./ui/card";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

type SilentCommunity = {
  id: string;
  villageName: string;
  villageNameBn: string;
  populationContacted: number;
  responsesReceived: number;
};

export function SilentCommunityAlert() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  const [rows, setRows] = useState<SilentCommunity[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.get<SilentCommunity[]>("/authority/silent-communities", token);
        setRows(data);
      } catch (error) {
        console.error("Failed to load silent communities", error);
      }
    };
    void loadData();
  }, []);

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
          {rows.map((community) => (
            <div key={community.id} className="bg-white p-4 rounded-lg border border-orange-200">
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
