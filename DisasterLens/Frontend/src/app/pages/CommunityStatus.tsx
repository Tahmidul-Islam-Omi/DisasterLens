import { Users, ShieldCheck, AlertCircle, Siren, UserX, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { StatusCard } from "../components/StatusCard";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { useLanguage } from "../i18n/LanguageContext";

interface CommunityResponse {
  name: string;
  nameBn: string;
  village: string;
  villageBn: string;
  phone: string;
  status: "safe" | "help" | "rescue" | "no-response";
  lastResponse: string;
  lastResponseBn: string;
}

const responseData: CommunityResponse[] = [
  { name: "Kamal Hossain", nameBn: "কামাল হোসেন", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1712-345678", status: "safe", lastResponse: "2 hours ago", lastResponseBn: "২ ঘণ্টা আগে" },
  { name: "Fatima Begum", nameBn: "ফাতেমা বেগম", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1823-456789", status: "safe", lastResponse: "1 hour ago", lastResponseBn: "১ ঘণ্টা আগে" },
  { name: "Abdul Rahman", nameBn: "আব্দুল রহমান", village: "Char Janajat", villageBn: "চর জনজাত", phone: "+880 1934-567890", status: "help", lastResponse: "30 min ago", lastResponseBn: "৩০ মিনিট আগে" },
  { name: "Rahima Khatun", nameBn: "রহিমা খাতুন", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1745-678901", status: "rescue", lastResponse: "15 min ago", lastResponseBn: "১৫ মিনিট আগে" },
  { name: "Mohammad Ali", nameBn: "মোহাম্মদ আলী", village: "Uttar Para", villageBn: "উত্তর পাড়া", phone: "+880 1856-789012", status: "no-response", lastResponse: "Never", lastResponseBn: "কখনো নয়" },
  { name: "Nasima Akter", nameBn: "নাসিমা আক্তার", village: "Paschim Bazar", villageBn: "পশ্চিম বাজার", phone: "+880 1967-890123", status: "safe", lastResponse: "3 hours ago", lastResponseBn: "৩ ঘণ্টা আগে" },
  { name: "Jamal Uddin", nameBn: "জামাল উদ্দিন", village: "Purba Ghosh Para", villageBn: "পূর্ব ঘোষ পাড়া", phone: "+880 1778-901234", status: "help", lastResponse: "45 min ago", lastResponseBn: "৪৫ মিনিট আগে" },
  { name: "Salma Begum", nameBn: "সালমা বেগম", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1889-012345", status: "safe", lastResponse: "1 hour ago", lastResponseBn: "১ ঘণ্টা আগে" },
];

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

export function CommunityStatus() {
  const { t, d } = useLanguage();

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatusCard title={t("community.totalMembers")} value={2547} icon={Users} variant="default" />
            <StatusCard title={t("status.reportedSafe")} value={1351} icon={ShieldCheck} variant="success" />
            <StatusCard title={t("status.needHelp")} value={49} icon={AlertCircle} variant="warning" />
            <StatusCard title={t("status.needRescue")} value={6} icon={Siren} variant="danger" />
            <StatusCard title={t("status.noResponse")} value={828} icon={UserX} variant="default" />
          </div>
        </section>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t("community.individualResponses")}</h2>
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder={t("community.searchPlaceholder")} className="pl-10" />
              </div>
            </div>

            <div className="rounded-md border">
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
                  {responseData.map((person, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{d(person.name, person.nameBn)}</TableCell>
                      <TableCell>{d(person.village, person.villageBn)}</TableCell>
                      <TableCell className="text-gray-600">{person.phone}</TableCell>
                      <TableCell>
                        <Badge className={statusStyles[person.status]}>
                          {t(statusKeys[person.status])}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{d(person.lastResponse, person.lastResponseBn)}</TableCell>
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
