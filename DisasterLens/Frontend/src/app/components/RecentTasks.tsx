import { ClipboardList, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router";
import { useLanguage } from "../i18n/LanguageContext";

const recentTasks = [
  {
    id: "T001",
    title: "Deliver relief supplies to Char Janajat",
    titleBn: "চর জনজাতে ত্রাণ সামগ্রী পৌঁছে দিন",
    priority: "critical" as const,
    assignedTo: "Aminul Islam",
    assignedToBn: "আমিনুল ইসলাম",
    status: "in-progress" as const,
  },
  {
    id: "T002",
    title: "Field assessment of flood damage",
    titleBn: "বন্যার ক্ষয়ক্ষতির মাঠ পর্যায়ের মূল্যায়ন",
    priority: "high" as const,
    assignedTo: "Shahida Akter",
    assignedToBn: "শাহিদা আক্তার",
    status: "assigned" as const,
  },
  {
    id: "T003",
    title: "Medical aid camp setup",
    titleBn: "চিকিৎসা সেবা ক্যাম্প স্থাপন",
    priority: "critical" as const,
    assignedTo: "Rahim Uddin",
    assignedToBn: "রহিম উদ্দিন",
    status: "in-progress" as const,
  },
];

const priorityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-blue-100 text-blue-800",
};

const priorityKeys: Record<string, string> = {
  critical: "priority.critical", high: "priority.high",
  medium: "priority.medium", low: "priority.low",
};

const statusStyles: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800",
  assigned: "bg-blue-100 text-blue-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
};

const statusKeys: Record<string, string> = {
  pending: "status.pending", assigned: "status.assigned",
  "in-progress": "status.inProgress", completed: "status.completed",
};

export function RecentTasks() {
  const navigate = useNavigate();
  const { t, d } = useLanguage();

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-lg text-gray-900">{t("task.activeTasksToday")}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/task-management")}>
            {t("common.viewAll")}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div key={task.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm mb-1">{d(task.title, task.titleBn)}</p>
                  <p className="text-xs text-gray-600">{t("common.assignedTo")}: {d(task.assignedTo, task.assignedToBn)}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge className={`${priorityStyles[task.priority]} text-xs`}>
                    {t(priorityKeys[task.priority])}
                  </Badge>
                  <Badge className={`${statusStyles[task.status]} text-xs`}>
                    {t(statusKeys[task.status])}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
          onClick={() => navigate("/task-management")}
        >
          <ClipboardList className="w-4 h-4 mr-2" />
          {t("task.manageAll")}
        </Button>
      </div>
    </Card>
  );
}
