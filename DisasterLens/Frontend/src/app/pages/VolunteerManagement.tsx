import { Users, UserPlus, ClipboardList, MapPin } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { AddVolunteerDialog } from "../components/AddVolunteerDialog";
import { useLanguage } from "../i18n/LanguageContext";

interface Volunteer {
  name: string;
  nameBn: string;
  phone: string;
  assignedArea: string;
  assignedAreaBn: string;
  tasksCompleted: number;
  status: "active" | "available" | "off-duty";
}

const volunteers: Volunteer[] = [
  { name: "Aminul Islam", nameBn: "আমিনুল ইসলাম", phone: "+880 1712-111222", assignedArea: "Dakshin Para", assignedAreaBn: "দক্ষিণ পাড়া", tasksCompleted: 12, status: "active" },
  { name: "Shahida Akter", nameBn: "শাহিদা আক্তার", phone: "+880 1823-222333", assignedArea: "Char Janajat", assignedAreaBn: "চর জনজাত", tasksCompleted: 8, status: "active" },
  { name: "Rahim Uddin", nameBn: "রহিম উদ্দিন", phone: "+880 1934-333444", assignedArea: "Madhya Gram", assignedAreaBn: "মধ্য গ্রাম", tasksCompleted: 15, status: "active" },
  { name: "Kulsum Begum", nameBn: "কুলসুম বেগম", phone: "+880 1745-444555", assignedArea: "Uttar Para", assignedAreaBn: "উত্তর পাড়া", tasksCompleted: 6, status: "active" },
  { name: "Habibur Rahman", nameBn: "হাবিবুর রহমান", phone: "+880 1856-555666", assignedArea: "Paschim Bazar", assignedAreaBn: "পশ্চিম বাজার", tasksCompleted: 10, status: "available" },
  { name: "Roksana Parvin", nameBn: "রোকসানা পারভিন", phone: "+880 1967-666777", assignedArea: "Not Assigned", assignedAreaBn: "নির্ধারিত নয়", tasksCompleted: 4, status: "available" },
  { name: "Khalid Hasan", nameBn: "খালিদ হাসান", phone: "+880 1778-777888", assignedArea: "Purba Ghosh Para", assignedAreaBn: "পূর্ব ঘোষ পাড়া", tasksCompleted: 9, status: "off-duty" },
];

const statusStyleMap: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  available: "bg-blue-100 text-blue-800",
  "off-duty": "bg-gray-100 text-gray-800",
};

const statusKeyMap: Record<string, string> = {
  active: "status.activeInField",
  available: "status.available",
  "off-duty": "status.offDuty",
};

export function VolunteerManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t, d } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold">{t("volunteer.title")}</h1>
          <p className="text-blue-200 mt-1">{t("volunteer.subtitle")}</p>
        </div>
      </header>

      <main className="px-8 py-8">
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("volunteer.totalVolunteers")}</p>
                  <p className="text-3xl font-semibold text-gray-900">24</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("status.activeInField")}</p>
                  <p className="text-3xl font-semibold text-green-700">16</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg"><MapPin className="w-6 h-6 text-green-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("status.available")}</p>
                  <p className="text-3xl font-semibold text-blue-700">5</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><UserPlus className="w-6 h-6 text-blue-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("volunteer.tasksCompleted")}</p>
                  <p className="text-3xl font-semibold text-gray-900">164</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg"><ClipboardList className="w-6 h-6 text-orange-700" /></div>
              </div>
            </Card>
          </div>
        </section>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t("volunteer.volunteerList")}</h2>
              <Button className="bg-blue-900 hover:bg-blue-800" onClick={() => setIsDialogOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                {t("volunteer.addNew")}
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("common.phone")}</TableHead>
                    <TableHead>{t("volunteer.assignedArea")}</TableHead>
                    <TableHead>{t("volunteer.tasksCompleted")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((volunteer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{d(volunteer.name, volunteer.nameBn)}</TableCell>
                      <TableCell className="text-gray-600">{volunteer.phone}</TableCell>
                      <TableCell>{d(volunteer.assignedArea, volunteer.assignedAreaBn)}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">{volunteer.tasksCompleted}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusStyleMap[volunteer.status]}>{t(statusKeyMap[volunteer.status])}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </Card>
      </main>

      <AddVolunteerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
