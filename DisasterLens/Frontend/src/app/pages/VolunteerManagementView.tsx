import { Users, UserPlus, ClipboardList, MapPin } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { AddVolunteerDialog } from "../components/AddVolunteerDialog";
import { useLanguage } from "../i18n/LanguageContext";
import type { Volunteer } from "../types";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

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

export function VolunteerManagementView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const { t, d } = useLanguage();
  const { token } = useAuth();

  const loadVolunteers = async () => {
    try {
      const data = await api.get<Volunteer[]>("/authority/volunteers", token);
      setVolunteers(data);
    } catch (error) {
      console.error("Failed to load volunteers", error);
    }
  };

  useEffect(() => {
    void loadVolunteers();
  }, []);

  const handleAddVolunteer = async (payload: Record<string, unknown>) => {
    await api.post<Volunteer>("/authority/volunteers", payload, token);
    await loadVolunteers();
  };

  const activeCount = volunteers.filter((v) => v.status === "active").length;
  const availableCount = volunteers.filter((v) => v.status === "available").length;
  const tasksCompleted = volunteers.reduce((sum, item) => sum + (item.tasksCompleted || 0), 0);

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
                  <p className="text-3xl font-semibold text-gray-900">{volunteers.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><Users className="w-6 h-6 text-blue-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("status.activeInField")}</p>
                  <p className="text-3xl font-semibold text-green-700">{activeCount}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg"><MapPin className="w-6 h-6 text-green-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("status.available")}</p>
                  <p className="text-3xl font-semibold text-blue-700">{availableCount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg"><UserPlus className="w-6 h-6 text-blue-700" /></div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t("volunteer.tasksCompleted")}</p>
                  <p className="text-3xl font-semibold text-gray-900">{tasksCompleted}</p>
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
                  {volunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
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

      <AddVolunteerDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleAddVolunteer} />
    </div>
  );
}
