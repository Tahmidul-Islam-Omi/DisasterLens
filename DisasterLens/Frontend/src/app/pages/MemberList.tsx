import { Users, Download, Search, Filter } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useLanguage } from "../i18n/LanguageContext";
import { members } from "../data/mockData";

export function MemberList() {
  const { t, d } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold">{t("member.title")}</h1>
          <p className="text-blue-200 mt-1">{t("member.subtitle")}</p>
        </div>
      </header>

      <main className="px-8 py-8">
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("member.totalMembers")}</p>
                  <p className="text-3xl font-semibold text-gray-900">2,547</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("member.totalHouseholds")}</p>
                  <p className="text-3xl font-semibold text-gray-900">612</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg"><Users className="w-6 h-6 text-green-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("member.villages")}</p>
                  <p className="text-3xl font-semibold text-gray-900">6</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg"><Users className="w-6 h-6 text-orange-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("member.registeredPhones")}</p>
                  <p className="text-3xl font-semibold text-gray-900">1,823</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-700" /></div>
              </div>
            </Card>
          </div>
        </section>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t("member.directory")}</h2>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {t("common.filter")}
                </Button>
                <Button className="bg-blue-900 hover:bg-blue-800">
                  <Download className="w-4 h-4 mr-2" />
                  {t("member.exportExcel")}
                </Button>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder={t("member.searchPlaceholder")} className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t("village.allVillages")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("village.allVillages")}</SelectItem>
                  <SelectItem value="dakshin">{t("village.dakshinPara")}</SelectItem>
                  <SelectItem value="madhya">{t("village.madhyaGram")}</SelectItem>
                  <SelectItem value="char">{t("village.charJanajat")}</SelectItem>
                  <SelectItem value="uttar">{t("village.uttarPara")}</SelectItem>
                  <SelectItem value="paschim">{t("village.paschimBazar")}</SelectItem>
                  <SelectItem value="purba">{t("village.purbaGhoshPara")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("member.memberId")}</TableHead>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("common.age")}</TableHead>
                    <TableHead>{t("common.gender")}</TableHead>
                    <TableHead>{t("common.village")}</TableHead>
                    <TableHead>{t("common.phone")}</TableHead>
                    <TableHead>{t("member.household")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-mono text-sm">{member.id}</TableCell>
                      <TableCell className="font-medium">{d(member.name, member.nameBn)}</TableCell>
                      <TableCell>{member.age}</TableCell>
                      <TableCell>{d(member.gender, member.genderBn)}</TableCell>
                      <TableCell>{d(member.village, member.villageBn)}</TableCell>
                      <TableCell className="text-gray-600">{member.phone}</TableCell>
                      <TableCell className="font-mono text-sm">{member.household}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
              {t("member.showingCount")}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
