import { useState } from "react";
import { ClipboardList, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { useLanguage } from "../i18n/LanguageContext";

type VolunteerOption = {
  id: string;
  name: string;
  nameBn: string;
  status: string;
};

interface AssignTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: Record<string, unknown>) => Promise<void> | void;
  volunteerOptions?: VolunteerOption[];
}

const volunteerStatusStyles: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  active: "bg-blue-100 text-blue-800",
  "off-duty": "bg-gray-100 text-gray-800",
};

const volunteerStatusKeys: Record<string, string> = {
  available: "status.available",
  active: "status.activeInField",
  "off-duty": "status.offDuty",
};

export function AssignTaskDialog({ open, onOpenChange, onSubmit, volunteerOptions = [] }: AssignTaskDialogProps) {
  const { t, d } = useLanguage();
  const [formData, setFormData] = useState({
    title: "", type: "", priority: "", description: "", location: "", duration: "", startDateTime: "", deadline: "", equipmentNeeded: "", contactPerson: "", contactPhone: "", specialInstructions: "", requiredSkills: "",
  });
  const [selectedVolunteers, setSelectedVolunteers] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({
        title: formData.title,
        titleBn: formData.title,
        type: formData.type,
        typeBn: formData.type,
        priority: formData.priority,
        location: formData.location,
        locationBn: formData.location,
        assignedTo: selectedVolunteers.map((id) => getVolunteerName(id)),
        assignedToBn: selectedVolunteers.map((id) => getVolunteerName(id)),
        status: selectedVolunteers.length > 0 ? "assigned" : "pending",
        progress: 0,
        deadline: formData.deadline,
        deadlineBn: formData.deadline,
        description: formData.description,
        startTime: formData.startDateTime,
        equipmentNeeded: formData.equipmentNeeded
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
    }
    onOpenChange(false);
    setFormData({ title: "", type: "", priority: "", description: "", location: "", duration: "", startDateTime: "", deadline: "", equipmentNeeded: "", contactPerson: "", contactPhone: "", specialInstructions: "", requiredSkills: "" });
    setSelectedVolunteers([]);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleVolunteer = (volunteerId: string) => {
    setSelectedVolunteers(prev => prev.includes(volunteerId) ? prev.filter(id => id !== volunteerId) : [...prev, volunteerId]);
  };

  const removeVolunteer = (volunteerId: string) => {
    setSelectedVolunteers(prev => prev.filter(id => id !== volunteerId));
  };

  const getVolunteerName = (id: string) => {
    const v = volunteerOptions.find(vol => vol.id === id);
    return v ? d(v.name, v.nameBn) : "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-orange-100 rounded-lg"><ClipboardList className="w-6 h-6 text-orange-700" /></div>
            {t("assignTask.title")}
          </DialogTitle>
          <DialogDescription>{t("assignTask.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("assignTask.taskDetails")}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("assignTask.taskTitle")} <span className="text-red-500">*</span></Label>
                  <Input id="title" placeholder={t("assignTask.taskTitlePlaceholder")} value={formData.title} onChange={(e) => handleChange("title", e.target.value)} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">{t("assignTask.taskType")} <span className="text-red-500">*</span></Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} required>
                      <SelectTrigger id="type"><SelectValue placeholder={t("assignTask.selectType")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assessment">{t("assignTask.typeAssessment")}</SelectItem>
                        <SelectItem value="relief">{t("assignTask.typeRelief")}</SelectItem>
                        <SelectItem value="rescue">{t("assignTask.typeRescue")}</SelectItem>
                        <SelectItem value="medical">{t("assignTask.typeMedical")}</SelectItem>
                        <SelectItem value="evacuation">{t("assignTask.typeEvacuation")}</SelectItem>
                        <SelectItem value="communication">{t("assignTask.typeCommunication")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">{t("assignTask.priorityLevel")} <span className="text-red-500">*</span></Label>
                    <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)} required>
                      <SelectTrigger id="priority"><SelectValue placeholder={t("assignTask.selectPriority")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">{t("priority.criticalEmoji")}</SelectItem>
                        <SelectItem value="high">{t("priority.highEmoji")}</SelectItem>
                        <SelectItem value="medium">{t("priority.mediumEmoji")}</SelectItem>
                        <SelectItem value="low">{t("priority.lowEmoji")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("assignTask.taskDescription")} <span className="text-red-500">*</span></Label>
                  <Textarea id="description" placeholder={t("assignTask.taskDescPlaceholder")} value={formData.description} onChange={(e) => handleChange("description", e.target.value)} className="min-h-24" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">{t("assignTask.locationArea")} <span className="text-red-500">*</span></Label>
                    <Select value={formData.location} onValueChange={(value) => handleChange("location", value)} required>
                      <SelectTrigger id="location"><SelectValue placeholder={t("assignTask.selectLocation")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dakshin">{t("village.dakshinPara")}</SelectItem>
                        <SelectItem value="madhya">{t("village.madhyaGram")}</SelectItem>
                        <SelectItem value="char">{t("village.charJanajat")}</SelectItem>
                        <SelectItem value="uttar">{t("village.uttarPara")}</SelectItem>
                        <SelectItem value="paschim">{t("village.paschimBazar")}</SelectItem>
                        <SelectItem value="purba">{t("village.purbaGhoshPara")}</SelectItem>
                        <SelectItem value="custom">{t("village.otherLocation")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">{t("assignTask.estimatedDuration")} <span className="text-red-500">*</span></Label>
                    <Input id="duration" placeholder={t("assignTask.durationPlaceholder")} value={formData.duration} onChange={(e) => handleChange("duration", e.target.value)} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">{t("assignTask.requiredSkills")}</Label>
                  <Input id="requiredSkills" placeholder={t("assignTask.skillsPlaceholder")} value={formData.requiredSkills} onChange={(e) => handleChange("requiredSkills", e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("assignTask.volunteerAssignment")}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("assignTask.assignToVolunteers")} <span className="text-red-500">*</span></Label>
                  <p className="text-xs text-gray-500 mb-3">{t("assignTask.volunteerHelp")}</p>

                  {selectedVolunteers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 p-3 bg-blue-50 rounded-lg">
                      {selectedVolunteers.map((volunteerId) => (
                        <Badge key={volunteerId} className="bg-blue-100 text-blue-800 pr-1 pl-3 py-1.5">
                          {getVolunteerName(volunteerId)}
                          <button
                            type="button"
                            onClick={() => removeVolunteer(volunteerId)}
                            className="ml-2 hover:bg-blue-200 rounded-full p-0.5"
                            title="Remove volunteer"
                            aria-label="Remove volunteer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                    {volunteerOptions.map((volunteer) => (
                      <div key={volunteer.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                        <Checkbox id={volunteer.id} checked={selectedVolunteers.includes(volunteer.id)} onCheckedChange={() => toggleVolunteer(volunteer.id)} />
                        <label htmlFor={volunteer.id} className="flex-1 text-sm font-medium leading-none cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span>{d(volunteer.name, volunteer.nameBn)}</span>
                            <Badge className={volunteerStatusStyles[volunteer.status]}>
                              {t(volunteerStatusKeys[volunteer.status])}
                            </Badge>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{selectedVolunteers.length} {t("assignTask.volunteersSelected")}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("assignTask.schedule")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDateTime">{t("assignTask.startDateTime")} <span className="text-red-500">*</span></Label>
                  <Input id="startDateTime" type="datetime-local" value={formData.startDateTime} onChange={(e) => handleChange("startDateTime", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">{t("task.deadline")} <span className="text-red-500">*</span></Label>
                  <Input id="deadline" type="datetime-local" value={formData.deadline} onChange={(e) => handleChange("deadline", e.target.value)} required />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("assignTask.additionalInfo")}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentNeeded">{t("assignTask.equipmentNeeded")}</Label>
                  <Textarea id="equipmentNeeded" placeholder={t("assignTask.equipmentPlaceholder")} value={formData.equipmentNeeded} onChange={(e) => handleChange("equipmentNeeded", e.target.value)} className="min-h-20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">{t("assignTask.localContact")}</Label>
                    <Input id="contactPerson" placeholder={t("assignTask.contactNamePlaceholder")} value={formData.contactPerson} onChange={(e) => handleChange("contactPerson", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">{t("assignTask.contactPhone")}</Label>
                    <Input id="contactPhone" type="tel" placeholder="+880 1XXX-XXXXXX" value={formData.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">{t("assignTask.specialInstructions")}</Label>
                  <Textarea id="specialInstructions" placeholder={t("assignTask.instructionsPlaceholder")} value={formData.specialInstructions} onChange={(e) => handleChange("specialInstructions", e.target.value)} className="min-h-20" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">{t("assignTask.smsNotice")}</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700" disabled={selectedVolunteers.length === 0}>
              <ClipboardList className="w-4 h-4 mr-2" />
              {t("assignTask.submitButton", { count: selectedVolunteers.length })}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
