import { Card } from "./ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { useLanguage } from "../i18n/LanguageContext";

interface VillageStatus {
  villageName: string;
  villageNameBn: string;
  safe: number;
  needHelp: number;
  needRescue: number;
  noResponse: number;
}

const villageData: VillageStatus[] = [
  { villageName: "Dakshin Para", villageNameBn: "দক্ষিণ পাড়া", safe: 342, needHelp: 12, needRescue: 3, noResponse: 18 },
  { villageName: "Madhya Gram", villageNameBn: "মধ্য গ্রাম", safe: 289, needHelp: 8, needRescue: 0, noResponse: 25 },
  { villageName: "Char Janajat", villageNameBn: "চর জনজাত", safe: 18, needHelp: 5, needRescue: 0, noResponse: 427 },
  { villageName: "Uttar Para", villageNameBn: "উত্তর পাড়া", safe: 12, needHelp: 3, needRescue: 0, noResponse: 305 },
  { villageName: "Paschim Bazar", villageNameBn: "পশ্চিম বাজার", safe: 412, needHelp: 15, needRescue: 2, noResponse: 31 },
  { villageName: "Purba Ghosh Para", villageNameBn: "পূর্ব ঘোষ পাড়া", safe: 278, needHelp: 6, needRescue: 1, noResponse: 22 },
];

export function VillageStatusTable() {
  const { t, d } = useLanguage();

  return (
    <Card>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">{t("villageStatus.title")}</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("silentAlert.villageName")}</TableHead>
                <TableHead className="text-right">{t("status.safe")}</TableHead>
                <TableHead className="text-right">{t("status.needHelp")}</TableHead>
                <TableHead className="text-right">{t("status.needRescue")}</TableHead>
                <TableHead className="text-right">{t("status.noResponse")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {villageData.map((village, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{d(village.villageName, village.villageNameBn)}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium">{village.safe}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-medium">{village.needHelp}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 rounded-md text-sm font-medium">{village.needRescue}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm font-medium">{village.noResponse}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
