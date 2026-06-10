import { Users, ShieldCheck, AlertCircle, Siren, UserX, Search, HeartPulse, Activity, Zap, Droplet, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { StatusCard } from "../components/StatusCard";
import { Button } from "../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import type { CommunityResponse } from "../types";
import { toast } from "sonner";

type AuthorityOverview = {
  totalCommunityMembers: number;
  reportedSafe: number;
  needHelp: number;
  needRescue: number;
  noResponse: number;
};

const statusStyles: Record<string, string> = {
  safe: "bg-green-100 text-green-800",
  help: "bg-orange-100 text-orange-800",
  rescue: "bg-red-100 text-red-800",
  "no-response": "bg-gray-100 text-gray-800",
};

const statusKeys: Record<string, string> = {
  safe: "status.safe",
  help: "status.needHelp",
  rescue: "status.needRescue",
  "no-response": "status.noResponse",
};

export function CommunityResponseListView() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  type CommunityResponseRow = CommunityResponse & {
    id?: string;
    floodLevel?: number;
    dangerLevel?: number;
    householdsAffected?: number;
    shelterOccupancy?: number;
    electricity?: string;
    communication?: string;
    cleanWater?: string;
    roadAccess?: string;
    healthEmergency?: boolean;
  };

  const [communityResponses, setCommunityResponses] = useState<CommunityResponseRow[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeResponseId, setActiveResponseId] = useState<string>("");
  const [activeUnion, setActiveUnion] = useState<string>("");
  const [activeUnionBn, setActiveUnionBn] = useState<string>("");
  const [floodLevel, setFloodLevel] = useState<number>(0);
  const [dangerLevel, setDangerLevel] = useState<number>(1);
  const [householdsAffected, setHouseholdsAffected] = useState<number>(0);
  const [shelterOccupancy, setShelterOccupancy] = useState<number>(0);
  const [electricity, setElectricity] = useState<string>("partial");
  const [communication, setCommunication] = useState<string>("spotty");
  const [cleanWater, setCleanWater] = useState<string>("adequate");
  const [roadAccess, setRoadAccess] = useState<string>("clear");
  const [healthEmergency, setHealthEmergency] = useState<boolean>(false);
  const [savedSnapshot, setSavedSnapshot] = useState<{
    floodLevel: number;
    dangerLevel: number;
    householdsAffected: number;
    shelterOccupancy: number;
    electricity: string;
    communication: string;
    cleanWater: string;
    roadAccess: string;
    healthEmergency: boolean;
  } | null>(null);
  const [overview, setOverview] = useState<AuthorityOverview>({
    totalCommunityMembers: 0,
    reportedSafe: 0,
    needHelp: 0,
    needRescue: 0,
    noResponse: 0,
  });

  const load = async () => {
    try {
      const [responses, overviewData] = await Promise.all([
        api.get<CommunityResponseRow[]>("/authority/community-responses", token),
        api.get<AuthorityOverview>("/authority/dashboard/overview", token),
      ]);
      setCommunityResponses(responses);
      setOverview(overviewData);
    } catch (error) {
      console.error("Failed to load community responses", error);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const saveEdit = async () => {
    if (!activeResponseId) {
      toast.error(t("error_occurred"));
      return;
    }

    try {
      setIsSaving(true);
      await api.patch(
        `/authority/community-responses/${activeResponseId}`,
        {
          floodLevel,
          dangerLevel,
          householdsAffected,
          shelterOccupancy,
          electricity,
          communication,
          cleanWater,
          roadAccess,
          healthEmergency,
        },
        token,
      );

      toast.success(t("update_status"));
      setSavedSnapshot({
        floodLevel,
        dangerLevel,
        householdsAffected,
        shelterOccupancy,
        electricity,
        communication,
        cleanWater,
        roadAccess,
        healthEmergency,
      });
      await load();
    } catch (error) {
      console.error("Failed to update community response", error);
      toast.error(t("error_occurred"));
    } finally {
      setIsSaving(false);
    }
  };

  const filteredResponses = communityResponses.filter((response) => {
    const q = searchText.trim().toLowerCase();
    if (!q) {
      return true;
    }

    return [response.name, response.village, response.phone]
      .map((item) => String(item || "").toLowerCase())
      .some((item) => item.includes(q));
  });

  const detailedResponses = communityResponses.filter((response) => (
    response.floodLevel !== undefined
    || response.dangerLevel !== undefined
    || response.householdsAffected !== undefined
    || response.shelterOccupancy !== undefined
    || response.electricity !== undefined
    || response.communication !== undefined
    || response.cleanWater !== undefined
    || response.roadAccess !== undefined
    || response.healthEmergency !== undefined
  ));

  const latestDetailedResponse = detailedResponses[0] || null;

  useEffect(() => {
    if (!latestDetailedResponse) {
      return;
    }

    setActiveResponseId(String(latestDetailedResponse.id || ""));
    setActiveUnion(String(latestDetailedResponse.village || ""));
    setActiveUnionBn(String(latestDetailedResponse.villageBn || latestDetailedResponse.village || ""));
    setFloodLevel(Number(latestDetailedResponse.floodLevel ?? 0));
    setDangerLevel(Number(latestDetailedResponse.dangerLevel ?? 1));
    setHouseholdsAffected(Number(latestDetailedResponse.householdsAffected ?? 0));
    setShelterOccupancy(Number(latestDetailedResponse.shelterOccupancy ?? 0));
    setElectricity(String(latestDetailedResponse.electricity ?? "partial"));
    setCommunication(String(latestDetailedResponse.communication ?? "spotty"));
    setCleanWater(String(latestDetailedResponse.cleanWater ?? "adequate"));
    setRoadAccess(String(latestDetailedResponse.roadAccess ?? "clear"));
    setHealthEmergency(Boolean(latestDetailedResponse.healthEmergency ?? false));
    setSavedSnapshot({
      floodLevel: Number(latestDetailedResponse.floodLevel ?? 0),
      dangerLevel: Number(latestDetailedResponse.dangerLevel ?? 1),
      householdsAffected: Number(latestDetailedResponse.householdsAffected ?? 0),
      shelterOccupancy: Number(latestDetailedResponse.shelterOccupancy ?? 0),
      electricity: String(latestDetailedResponse.electricity ?? "partial"),
      communication: String(latestDetailedResponse.communication ?? "spotty"),
      cleanWater: String(latestDetailedResponse.cleanWater ?? "adequate"),
      roadAccess: String(latestDetailedResponse.roadAccess ?? "clear"),
      healthEmergency: Boolean(latestDetailedResponse.healthEmergency ?? false),
    });
  }, [latestDetailedResponse?.id]);

  const handleDiscard = () => {
    if (!savedSnapshot) {
      return;
    }

    setFloodLevel(savedSnapshot.floodLevel);
    setDangerLevel(savedSnapshot.dangerLevel);
    setHouseholdsAffected(savedSnapshot.householdsAffected);
    setShelterOccupancy(savedSnapshot.shelterOccupancy);
    setElectricity(savedSnapshot.electricity);
    setCommunication(savedSnapshot.communication);
    setCleanWater(savedSnapshot.cleanWater);
    setRoadAccess(savedSnapshot.roadAccess);
    setHealthEmergency(savedSnapshot.healthEmergency);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold">{t("community.title")}</h1>
          <p className="text-blue-200 mt-1">{t("community.subtitle")}</p>
        </div>
      </header>

      <main className="px-8 py-8">
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatusCard title={t("dashboard.totalCommunityMembers")} value={overview.totalCommunityMembers} icon={Users} variant="default" />
            <StatusCard title={t("status.reportedSafe")} value={overview.reportedSafe} icon={ShieldCheck} variant="success" />
            <StatusCard title={t("status.needHelp")} value={overview.needHelp} icon={AlertCircle} variant="warning" />
            <StatusCard title={t("status.needRescue")} value={overview.needRescue} icon={Siren} variant="danger" />
            <StatusCard title={t("status.noResponse")} value={overview.noResponse} icon={UserX} variant="default" />
          </div>
        </section>

        <Card>
          <div className="p-6">
            {latestDetailedResponse ? (
              <div className="mb-6">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <HeartPulse className="w-6 h-6 text-[#1E3A8A]" />
                      {t("community_status_update")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{t("sector_info")}</p>
                    <input
                      type="text"
                      value={activeUnion}
                      readOnly
                      title={t("sector_info")}
                      aria-label={t("sector_info")}
                      className="mt-2 px-3 py-2 border border-gray-300 rounded-lg text-sm w-72 bg-gray-50 text-gray-700"
                    />
                    {activeUnionBn && activeUnionBn !== activeUnion ? <p className="text-xs text-gray-500 mt-1">{activeUnionBn}</p> : null}
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold border border-green-200 flex items-center gap-1 h-fit">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    {t("live_sync")}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" /> {t("current_condition")}
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700">{t("flood_water_level")}</label>
                            <span className="text-xs font-bold text-blue-700">{`${t("moderate")} (${(floodLevel / 25).toFixed(1)}m)`}</span>
                          </div>
                          <input type="range" min="0" max="100" value={floodLevel} onChange={(e) => setFloodLevel(Number(e.target.value))} className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600" title={t("flood_water_level")} aria-label={t("flood_water_level")} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium text-gray-700">{t("local_danger_level")}</label>
                            <span className="text-xs font-bold text-orange-600">{t("danger_level_value", { level: dangerLevel })}</span>
                          </div>
                          <input type="range" min="1" max="5" value={dangerLevel} onChange={(e) => setDangerLevel(Number(e.target.value))} className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500" title={t("local_danger_level")} aria-label={t("local_danger_level")} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-600" /> {t("population_impact")}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">{t("households_affected")}</label>
                          <Input type="number" value={householdsAffected} onChange={(e) => setHouseholdsAffected(Number(e.target.value || 0))} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">{t("shelter_occupancy")}</label>
                          <div className="flex items-center gap-2">
                            <Input type="number" value={shelterOccupancy} onChange={(e) => setShelterOccupancy(Number(e.target.value || 0))} />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-600" /> {t("infrastructure_supply")}
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t("electricity")}</p>
                              <p className="text-xs text-gray-500">{t("grid_status")}</p>
                            </div>
                          </div>
                          <select title={t("electricity")} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-red-600" value={electricity} onChange={(e) => setElectricity(e.target.value)}>
                            <option value="down">{t("grid_offline")}</option>
                            <option value="partial">{t("partial")}</option>
                            <option value="up">{t("grid_online")}</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t("communication")}</p>
                              <p className="text-xs text-gray-500">{t("cellular_radio")}</p>
                            </div>
                          </div>
                          <select title={t("communication")} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600" value={communication} onChange={(e) => setCommunication(e.target.value)}>
                            <option value="down">{t("offline")}</option>
                            <option value="partial">{t("spotty")}</option>
                            <option value="up">{t("good")}</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Droplet className="w-5 h-5 text-cyan-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t("clean_water")}</p>
                              <p className="text-xs text-gray-500">{t("drinking_supply")}</p>
                            </div>
                          </div>
                          <select title={t("clean_water")} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-red-600" value={cleanWater} onChange={(e) => setCleanWater(e.target.value)}>
                            <option value="critical">{t("critical")}</option>
                            <option value="low">{t("low")}</option>
                            <option value="adequate">{t("adequate")}</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{t("road_access")}</p>
                              <p className="text-xs text-gray-500">{t("main_routes")}</p>
                            </div>
                          </div>
                          <select title={t("road_access")} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white font-medium text-amber-600" value={roadAccess} onChange={(e) => setRoadAccess(e.target.value)}>
                            <option value="blocked">{t("blocked")}</option>
                            <option value="partial">{t("partial_access")}</option>
                            <option value="clear">{t("clear")}</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-red-100 rounded-lg bg-red-50">
                          <div className="flex items-center gap-3">
                            <HeartPulse className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-red-900">{t("health_emergency")}</p>
                              <p className="text-xs text-red-700">{t("immediate_medical")}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={healthEmergency} onChange={(e) => setHealthEmergency(e.target.checked)} title={t("health_emergency")} aria-label={t("health_emergency")} />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleDiscard}>{t("discard_changes")}</Button>
                  <Button type="button" className="bg-[#1E3A8A] hover:bg-blue-800" onClick={() => void saveEdit()} disabled={isSaving}>
                    <Check className="w-4 h-4 mr-2" />
                    {isSaving ? t("loading") : t("update_status")}
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t("community.responseDetails")}</h2>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder={t("community.searchPlaceholder")} className="pl-10" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("common.village")}</TableHead>
                    <TableHead>{t("common.phone")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead>{t("community.lastResponse")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses.map((response, index) => (
                    <TableRow key={response.id || index}>
                      <TableCell className="font-medium">{d(response.name, response.nameBn)}</TableCell>
                      <TableCell>{d(response.village, response.villageBn)}</TableCell>
                      <TableCell className="text-gray-600">{response.phone}</TableCell>
                      <TableCell>
                        <Badge className={statusStyles[response.status]}>
                          {t(statusKeys[response.status])}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">{d(response.lastResponse, response.lastResponseBn)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
