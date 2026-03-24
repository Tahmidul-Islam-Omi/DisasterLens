import { Card } from "./ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "./ui/table";
import { useLanguage } from "../i18n/LanguageContext";
import { villageStatusData } from "../data/mockData";

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
              {villageStatusData.map((village, index) => (
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
