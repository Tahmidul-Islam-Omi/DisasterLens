import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useLanguage } from "../i18n/LanguageContext";

interface AddVolunteerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (payload: Record<string, unknown>) => Promise<void> | void;
}

export function AddVolunteerDialog({ open, onOpenChange, onSubmit }: AddVolunteerDialogProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "", phone: "", email: "", village: "", address: "", skills: "", experience: "", availability: "", emergencyContact: "", emergencyPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit({
        name: formData.name,
        nameBn: formData.name,
        phone: formData.phone,
        assignedArea: formData.village,
        assignedAreaBn: formData.village,
        status: "available",
        tasksCompleted: 0,
      });
    }
    onOpenChange(false);
    setFormData({ name: "", age: "", gender: "", phone: "", email: "", village: "", address: "", skills: "", experience: "", availability: "", emergencyContact: "", emergencyPhone: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="p-2 bg-blue-100 rounded-lg"><UserPlus className="w-6 h-6 text-blue-700" /></div>
            {t("addVolunteer.title")}
          </DialogTitle>
          <DialogDescription>{t("addVolunteer.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("addVolunteer.personalInfo")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <Label htmlFor="name">{t("addVolunteer.fullName")} <span className="text-red-500">*</span></Label>
                  <Input id="name" placeholder={t("addVolunteer.enterName")} value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">{t("common.age")} <span className="text-red-500">*</span></Label>
                  <Input id="age" type="number" placeholder={t("addVolunteer.enterAge")} value={formData.age} onChange={(e) => handleChange("age", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">{t("common.gender")} <span className="text-red-500">*</span></Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)} required>
                    <SelectTrigger id="gender"><SelectValue placeholder={t("addVolunteer.selectGender")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("common.male")}</SelectItem>
                      <SelectItem value="female">{t("common.female")}</SelectItem>
                      <SelectItem value="other">{t("common.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("addVolunteer.phoneNumber")} <span className="text-red-500">*</span></Label>
                  <Input id="phone" type="tel" placeholder="+880 1XXX-XXXXXX" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                </div>
                <div className="col-span-2 md:col-span-1 space-y-2">
                  <Label htmlFor="email">{t("addVolunteer.email")}</Label>
                  <Input id="email" type="email" placeholder="volunteer@example.com" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">{t("addVolunteer.villageArea")} <span className="text-red-500">*</span></Label>
                  <Select value={formData.village} onValueChange={(value) => handleChange("village", value)} required>
                    <SelectTrigger id="village"><SelectValue placeholder={t("addVolunteer.selectVillage")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dakshin">{t("village.dakshinPara")}</SelectItem>
                      <SelectItem value="madhya">{t("village.madhyaGram")}</SelectItem>
                      <SelectItem value="char">{t("village.charJanajat")}</SelectItem>
                      <SelectItem value="uttar">{t("village.uttarPara")}</SelectItem>
                      <SelectItem value="paschim">{t("village.paschimBazar")}</SelectItem>
                      <SelectItem value="purba">{t("village.purbaGhoshPara")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">{t("addVolunteer.fullAddress")} <span className="text-red-500">*</span></Label>
                  <Textarea id="address" placeholder={t("addVolunteer.enterAddress")} value={formData.address} onChange={(e) => handleChange("address", e.target.value)} className="min-h-20" required />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("addVolunteer.skillsExperience")}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">{t("addVolunteer.skillsExpertise")} <span className="text-red-500">*</span></Label>
                  <Textarea id="skills" placeholder={t("addVolunteer.skillsPlaceholder")} value={formData.skills} onChange={(e) => handleChange("skills", e.target.value)} className="min-h-24" required />
                  <p className="text-xs text-gray-500">{t("addVolunteer.skillsHelp")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">{t("addVolunteer.previousExperience")}</Label>
                  <Textarea id="experience" placeholder={t("addVolunteer.experiencePlaceholder")} value={formData.experience} onChange={(e) => handleChange("experience", e.target.value)} className="min-h-20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">{t("addVolunteer.availability")} <span className="text-red-500">*</span></Label>
                  <Select value={formData.availability} onValueChange={(value) => handleChange("availability", value)} required>
                    <SelectTrigger id="availability"><SelectValue placeholder={t("addVolunteer.selectAvailability")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fulltime">{t("addVolunteer.fullTime")}</SelectItem>
                      <SelectItem value="weekdays">{t("addVolunteer.weekdaysOnly")}</SelectItem>
                      <SelectItem value="weekends">{t("addVolunteer.weekendsOnly")}</SelectItem>
                      <SelectItem value="emergency">{t("addVolunteer.emergencyOnly")}</SelectItem>
                      <SelectItem value="flexible">{t("addVolunteer.flexibleSchedule")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">{t("addVolunteer.emergencyContact")}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">{t("addVolunteer.contactName")} <span className="text-red-500">*</span></Label>
                  <Input id="emergencyContact" placeholder={t("addVolunteer.contactNamePlaceholder")} value={formData.emergencyContact} onChange={(e) => handleChange("emergencyContact", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">{t("addVolunteer.contactPhone")} <span className="text-red-500">*</span></Label>
                  <Input id="emergencyPhone" type="tel" placeholder="+880 1XXX-XXXXXX" value={formData.emergencyPhone} onChange={(e) => handleChange("emergencyPhone", e.target.value)} required />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{t("addVolunteer.emergencyNotice")}</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t("common.cancel")}</Button>
            <Button type="submit" className="bg-blue-900 hover:bg-blue-800">
              <UserPlus className="w-4 h-4 mr-2" />
              {t("addVolunteer.submitButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
