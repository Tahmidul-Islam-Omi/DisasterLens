import { useState } from "react";
import { ClipboardList, Plus, Filter, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TaskCard } from "../components/TaskCard";
import { AssignTaskDialog } from "../components/AssignTaskDialog";
import { useLanguage } from "../i18n/LanguageContext";

const mockTasks = [
  { id: "T001", title: "Deliver relief supplies to Char Janajat", titleBn: "চর জনজাতে ত্রাণ সামগ্রী পৌঁছে দিন", type: "Relief Distribution", typeBn: "ত্রাণ বিতরণ", priority: "critical" as const, location: "Char Janajat", locationBn: "চর জনজাত", assignedTo: ["Aminul Islam", "Shahida Akter", "Rahim Uddin"], assignedToBn: ["আমিনুল ইসলাম", "শাহিদা আক্তার", "রহিম উদ্দিন"], status: "in-progress" as const, progress: 65, deadline: "Today, 5:00 PM", deadlineBn: "আজ, ৫:০০ PM", description: "Distribute food packages and water bottles to 50 families in flood-affected area", startTime: "Today, 2:00 PM", equipmentNeeded: ["Relief packages", "Transport vehicle", "Mobile phone"] },
  { id: "T002", title: "Field assessment of flood damage in Uttar Para", titleBn: "উত্তর পাড়ায় বন্যার ক্ষয়ক্ষতির মাঠ মূল্যায়ন", type: "Field Assessment", typeBn: "মাঠ মূল্যায়ন", priority: "high" as const, location: "Uttar Para", locationBn: "উত্তর পাড়া", assignedTo: "Shahida Akter", assignedToBn: "শাহিদা আক্তার", status: "assigned" as const, progress: 0, deadline: "Today, 6:00 PM", deadlineBn: "আজ, ৬:০০ PM", description: "Assess flood damage to houses and infrastructure", startTime: "Today, 4:00 PM", equipmentNeeded: ["Camera", "Assessment form", "Notebook"] },
  { id: "T003", title: "Medical aid camp setup at Union Parishad Complex", titleBn: "ইউনিয়ন পরিষদ কমপ্লেক্সে চিকিৎসা সেবা ক্যাম্প স্থাপন", type: "Medical Aid", typeBn: "চিকিৎসা সেবা", priority: "critical" as const, location: "Union Parishad Complex", locationBn: "ইউনিয়ন পরিষদ কমপ্লেক্স", assignedTo: ["Rahim Uddin", "Kulsum Begum"], assignedToBn: ["রহিম উদ্দিন", "কুলসুম বেগম"], status: "in-progress" as const, progress: 80, deadline: "Today, 3:00 PM", deadlineBn: "আজ, ৩:০০ PM", description: "Set up medical camp with doctor", startTime: "Today, 10:00 AM", equipmentNeeded: ["First aid kits", "Medicines", "Tables and chairs"] },
  { id: "T004", title: "Evacuation support for elderly residents", titleBn: "বয়স্ক বাসিন্দাদের সরিয়ে নেওয়ার সহায়তা", type: "Evacuation Support", typeBn: "সরিয়ে নেওয়ার সহায়তা", priority: "critical" as const, location: "Dakshin Para", locationBn: "দক্ষিণ পাড়া", assignedTo: ["Kulsum Begum", "Habibur Rahman"], assignedToBn: ["কুলসুম বেগম", "হাবিবুর রহমান"], status: "completed" as const, progress: 100, deadline: "Today, 12:00 PM", deadlineBn: "আজ, ১২:০০ PM", description: "Assist elderly residents in moving to shelter", startTime: "Today, 9:00 AM", equipmentNeeded: ["Transport vehicle", "Wheelchair"] },
  { id: "T005", title: "Communication support - door to door alert", titleBn: "যোগাযোগ সহায়তা - বাড়ি বাড়ি সতর্কতা", type: "Communication Support", typeBn: "যোগাযোগ সহায়তা", priority: "high" as const, location: "Paschim Bazar", locationBn: "পশ্চিম বাজার", assignedTo: "Habibur Rahman", assignedToBn: "হাবিবুর রহমান", status: "pending" as const, progress: 0, deadline: "Tomorrow, 10:00 AM", deadlineBn: "আগামীকাল, ১০:০০ AM", description: "Visit households and inform about heavy rainfall", startTime: "Tomorrow, 8:00 AM", equipmentNeeded: ["Megaphone", "Alert pamphlets"] },
  { id: "T006", title: "Rescue support near Padma river area", titleBn: "পদ্মা নদী এলাকায় উদ্ধার সহায়তা", type: "Rescue Support", typeBn: "উদ্ধার সহায়তা", priority: "medium" as const, location: "Madhya Gram", locationBn: "মধ্য গ্রাম", assignedTo: ["Roksana Parvin", "Khalid Hasan"], assignedToBn: ["রোকসানা পারভিন", "খালিদ হাসান"], status: "overdue" as const, progress: 40, deadline: "Yesterday, 4:00 PM", deadlineBn: "গতকাল, ৪:০০ PM", description: "Support rescue team in evacuating stranded families", startTime: "Yesterday, 2:00 PM", equipmentNeeded: ["Life jackets", "Ropes", "Emergency kit"] },
];

export function TaskManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t, d } = useLanguage();

  const activeTasks = mockTasks.filter(task => ["assigned", "in-progress"].includes(task.status));
  const pendingTasks = mockTasks.filter(task => task.status === "pending");
  const completedTasks = mockTasks.filter(task => task.status === "completed");
  const overdueTasks = mockTasks.filter(task => task.status === "overdue");

  const translateTask = (task: typeof mockTasks[0]) => ({
    ...task,
    title: d(task.title, task.titleBn),
    location: d(task.location, task.locationBn),
    deadline: d(task.deadline, task.deadlineBn),
    assignedTo: Array.isArray(task.assignedTo)
      ? task.assignedTo.map((name, i) => d(name, (task.assignedToBn as string[])[i]))
      : d(task.assignedTo as string, task.assignedToBn as string),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold text-white">{t("task.title")}</h1>
          <p className="mt-1 text-blue-200">{t("task.subtitle")}</p>
        </div>
      </header>

      <main className="px-8 py-8">
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1 text-gray-500">{t("task.activeTasks")}</p>
                  <p className="text-3xl font-semibold text-blue-900">{activeTasks.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-100"><ClipboardList className="w-6 h-6 text-blue-900" /></div>
              </div>
            </Card>
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1 text-gray-500">{t("status.pending")}</p>
                  <p className="text-3xl font-semibold text-sky-500">{pendingTasks.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-sky-100"><ClipboardList className="w-6 h-6 text-sky-500" /></div>
              </div>
            </Card>
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1 text-gray-500">{t("task.completedToday")}</p>
                  <p className="text-3xl font-semibold text-green-600">{completedTasks.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-100"><ClipboardList className="w-6 h-6 text-green-600" /></div>
              </div>
            </Card>
            <Card className="p-6 bg-white border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm mb-1 text-gray-500">{t("status.overdue")}</p>
                  <p className="text-3xl font-semibold text-red-600">{overdueTasks.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-red-100"><ClipboardList className="w-6 h-6 text-red-600" /></div>
              </div>
            </Card>
          </div>
        </section>

        <Card className="bg-white border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t("task.allTasks")}</h2>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t("task.createNew")}
              </Button>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("task.searchPlaceholder")}
                  className="pl-10 border-gray-200 text-gray-900"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-gray-200 text-gray-500">
                <Filter className="w-4 h-4 mr-2" />
                {t("common.filter")}
              </Button>
            </div>

            <Tabs defaultValue="active" className="space-y-4">
              <TabsList>
                <TabsTrigger value="active">{t("task.active")} ({activeTasks.length})</TabsTrigger>
                <TabsTrigger value="pending">{t("status.pending")} ({pendingTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">{t("status.completed")} ({completedTasks.length})</TabsTrigger>
                <TabsTrigger value="overdue">{t("status.overdue")} ({overdueTasks.length})</TabsTrigger>
                <TabsTrigger value="all">{t("task.all")} ({mockTasks.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-3">
                {activeTasks.map((task) => <TaskCard key={task.id} task={translateTask(task)} />)}
              </TabsContent>
              <TabsContent value="pending" className="space-y-3">
                {pendingTasks.map((task) => <TaskCard key={task.id} task={translateTask(task)} />)}
              </TabsContent>
              <TabsContent value="completed" className="space-y-3">
                {completedTasks.map((task) => <TaskCard key={task.id} task={translateTask(task)} />)}
              </TabsContent>
              <TabsContent value="overdue" className="space-y-3">
                {overdueTasks.map((task) => <TaskCard key={task.id} task={translateTask(task)} />)}
              </TabsContent>
              <TabsContent value="all" className="space-y-3">
                {mockTasks.map((task) => <TaskCard key={task.id} task={translateTask(task)} />)}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </main>

      <AssignTaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}
