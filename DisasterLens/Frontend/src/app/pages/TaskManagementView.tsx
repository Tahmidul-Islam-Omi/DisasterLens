import { useEffect, useState } from "react";
import { ClipboardList, Plus, Filter, Search } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { TaskCard } from "../components/TaskCard";
import { AssignTaskDialog } from "../components/AssignTaskDialog";
import { useLanguage } from "../i18n/LanguageContext";
import type { Task } from "../types";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

export function TaskManagementView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [volunteerOptions, setVolunteerOptions] = useState<Array<{ id: string; name: string; nameBn: string; status: string }>>([]);
  const { t, d } = useLanguage();
  const { token } = useAuth();

  const loadTasks = async () => {
    try {
      const data = await api.get<Task[]>("/authority/tasks", token);
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    }
  };

  const loadVolunteers = async () => {
    try {
      const data = await api.get<Array<{ id: string; name: string; nameBn?: string; status: string }>>("/authority/volunteers", token);
      setVolunteerOptions(
        data.map((v) => ({
          id: v.id,
          name: v.name,
          nameBn: v.nameBn || v.name,
          status: v.status,
        })),
      );
    } catch (error) {
      console.error("Failed to load volunteers", error);
    }
  };

  useEffect(() => {
    void loadTasks();
    void loadVolunteers();
  }, []);

  const activeTasks = tasks.filter(task => ["assigned", "in-progress"].includes(task.status));
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const completedTasks = tasks.filter(task => task.status === "completed");
  const overdueTasks = tasks.filter(task => task.status === "overdue");
  const handleCreateTask = async (payload: Record<string, unknown>) => {
    await api.post<Task>("/authority/tasks", payload, token);
    await loadTasks();
  };


  const translateTask = (task: Task) => ({
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
                <TabsTrigger value="all">{t("task.all")} ({tasks.length})</TabsTrigger>
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
                {tasks.map((task) => <TaskCard key={task.id} task={translateTask(task)} />)}
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </main>

      <AssignTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateTask}
        volunteerOptions={volunteerOptions}
      />
    </div>
  );
}
