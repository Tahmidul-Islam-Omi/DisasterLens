import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";

interface StatusCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "bg-blue-50 text-blue-900",
  success: "bg-green-50 text-green-900",
  warning: "bg-orange-50 text-orange-900",
  danger: "bg-red-50 text-red-900",
};

const iconStyles = {
  default: "bg-blue-100 text-blue-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-orange-100 text-orange-700",
  danger: "bg-red-100 text-red-700",
};

export function StatusCard({ title, value, icon: Icon, variant }: StatusCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconStyles[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
