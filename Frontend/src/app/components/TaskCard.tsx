import { Clock, MapPin, User, Users, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useLanguage } from "../i18n/LanguageContext";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    type: string;
    priority: "critical" | "high" | "medium" | "low";
    location: string;
    assignedTo: string | string[];
    status: "pending" | "assigned" | "in-progress" | "completed" | "overdue";
    progress: number;
    deadline: string;
  };
  onClick?: () => void;
}

const priorityStyles = {
  critical: { badge: "bg-red-100 text-red-600", border: "border-l-red-600" },
  high:     { badge: "bg-amber-100 text-amber-500", border: "border-l-amber-500" },
  medium:   { badge: "bg-yellow-100 text-yellow-600", border: "border-l-yellow-600" },
  low:      { badge: "bg-blue-100 text-blue-900", border: "border-l-blue-900" },
};

const statusStyles = {
  pending:       "bg-gray-100 text-gray-500",
  assigned:      "bg-sky-100 text-sky-500",
  "in-progress": "bg-blue-100 text-blue-900",
  completed:     "bg-green-100 text-green-600",
  overdue:       "bg-red-100 text-red-600",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { t } = useLanguage();

  const priorityKeys: Record<string, string> = {
    critical: "priority.critical", high: "priority.high",
    medium: "priority.medium", low: "priority.low",
  };

  const statusKeys: Record<string, string> = {
    pending: "status.pending", assigned: "status.assigned",
    "in-progress": "status.inProgress", completed: "status.completed",
    overdue: "status.overdue",
  };

  const isTeamTask = Array.isArray(task.assignedTo);
  const assignedText = isTeamTask
    ? t("task.teamAssignment", { count: task.assignedTo.length })
    : task.assignedTo;

  return (
    <Card
      className={`p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 bg-white border-gray-200 ${priorityStyles[task.priority].border}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold mb-1 text-gray-900">{task.title}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={`border-0 ${priorityStyles[task.priority].badge}`}>{t(priorityKeys[task.priority])}</Badge>
              <Badge className={`border-0 ${statusStyles[task.status]}`}>{t(statusKeys[task.status])}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{task.location}</span></div>
          <div className="flex items-center gap-2">{isTeamTask ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}<span>{assignedText}</span></div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{t("task.deadline")}: {task.deadline}</span></div>
        </div>

        {task.status === "in-progress" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{t("task.progress")}</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
}
