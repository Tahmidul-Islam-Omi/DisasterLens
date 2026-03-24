import { Users, Download, Search, Filter } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useLanguage } from "../i18n/LanguageContext";

interface Member {
  id: string;
  name: string;
  nameBn: string;
  age: number;
  gender: string;
  genderBn: string;
  village: string;
  villageBn: string;
  phone: string;
  household: string;
}

const members: Member[] = [
  { id: "CM001", name: "Kamal Hossain", nameBn: "কামাল হোসেন", age: 45, gender: "Male", genderBn: "পুরুষ", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1712-345678", household: "HH-001" },
  { id: "CM002", name: "Fatima Begum", nameBn: "ফাতেমা বেগম", age: 38, gender: "Female", genderBn: "মহিলা", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1823-456789", household: "HH-002" },
  { id: "CM003", name: "Abdul Rahman", nameBn: "আব্দুল রহমান", age: 52, gender: "Male", genderBn: "পুরুষ", village: "Char Janajat", villageBn: "চর জনজাত", phone: "+880 1934-567890", household: "HH-003" },
  { id: "CM004", name: "Rahima Khatun", nameBn: "রহিমা খাতুন", age: 29, gender: "Female", genderBn: "মহিলা", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1745-678901", household: "HH-004" },
  { id: "CM005", name: "Mohammad Ali", nameBn: "মোহাম্মদ আলী", age: 61, gender: "Male", genderBn: "পুরুষ", village: "Uttar Para", villageBn: "উত্তর পাড়া", phone: "+880 1856-789012", household: "HH-005" },
  { id: "CM006", name: "Nasima Akter", nameBn: "নাসিমা আক্তার", age: 34, gender: "Female", genderBn: "মহিলা", village: "Paschim Bazar", villageBn: "পশ্চিম বাজার", phone: "+880 1967-890123", household: "HH-006" },
  { id: "CM007", name: "Jamal Uddin", nameBn: "জামাল উদ্দিন", age: 47, gender: "Male", genderBn: "পুরুষ", village: "Purba Ghosh Para", villageBn: "পূর্ব ঘোষ পাড়া", phone: "+880 1778-901234", household: "HH-007" },
  { id: "CM008", name: "Salma Begum", nameBn: "সালমা বেগম", age: 42, gender: "Female", genderBn: "মহিলা", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1889-012345", household: "HH-008" },
  { id: "CM009", name: "Ruhul Amin", nameBn: "রুহুল আমিন", age: 55, gender: "Male", genderBn: "পুরুষ", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1990-123456", household: "HH-009" },
  { id: "CM010", name: "Shapla Khatun", nameBn: "শাপলা খাতুন", age: 26, gender: "Female", genderBn: "মহিলা", village: "Char Janajat", villageBn: "চর জনজাত", phone: "+880 1701-234567", household: "HH-010" },
];

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
