import { AlertCircle, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useLanguage } from "../i18n/LanguageContext";
import { villages } from "../data/mockData";

export function CreateAlert() {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [simplifiedMessage, setSimplifiedMessage] = useState("");
  const [showSimplified, setShowSimplified] = useState(false);
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSimplified = () => {
    if (!message.trim()) {
      alert(t("alert.writeMessageFirst"));
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const simplified = `⚠️ জরুরি সতর্কতা\n\nআজ বিকেল ৫টা থেকে ভারী বৃষ্টি হতে পারে। পদ্মা নদীর পানি বৃদ্ধি পাচ্ছে।\n\n✅ করণীয়:\n• জরুরি জিনিসপত্র প্রস্তুত রাখুন\n• নিচু এলাকা থেকে সরে যান\n• জরুরি নম্বর: 01XXX-XXXXXX\n\nসতর্ক থাকুন, নিরাপদ থাকুন।`;
      setSimplifiedMessage(simplified);
      setShowSimplified(true);
      setIsGenerating(false);
    }, 1500);
  };

  const toggleVillage = (villageId: string) => {
    setSelectedVillages(prev =>
      prev.includes(villageId) ? prev.filter(id => id !== villageId) : [...prev, villageId]
    );
  };

  const selectAllVillages = () => {
    setSelectedVillages(prev => prev.length === villages.length ? [] : villages.map(v => v.id));
  };

  const expectedRecipients = villages
    .filter(v => selectedVillages.includes(v.id))
    .reduce((sum, v) => sum + v.members, 0);

  const totalMembers = villages.reduce((sum, v) => sum + v.members, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { alert(t("alert.writeMessage")); return; }
    if (selectedVillages.length === 0) { alert(t("alert.selectTargetArea")); return; }
    alert(t("alert.sentSuccess", { count: expectedRecipients }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold text-white">{t("alert.title")}</h1>
          <p className="mt-1 text-blue-200">{t("alert.subtitle")}</p>
        </div>
      </header>

      <main className="px-8 py-8 max-w-5xl">
        <Card className="bg-white border-gray-200">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-amber-100">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{t("alert.composeTitle")}</h2>
                <p className="text-sm text-gray-500">{t("alert.composeSubtitle")}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="message" className="text-base font-semibold text-gray-900">
                  {t("alert.disasterMessage")} <span className="text-red-600">*</span>
                </Label>
                <p className="text-sm text-gray-500">{t("alert.messageHelp")}</p>
                <Textarea
                  id="message"
                  placeholder={t("alert.messagePlaceholder")}
                  className="min-h-40 text-base border-gray-200 text-gray-900"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400">
                  {message.length} {t("common.characters")}
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  type="button" variant="outline" size="lg"
                  onClick={handleGenerateSimplified}
                  disabled={isGenerating || !message.trim()}
                  className={`w-full sm:w-auto border-sky-500 text-sky-500 ${isGenerating ? "bg-sky-50" : "bg-white"}`}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {isGenerating ? t("alert.generating") : t("alert.generateAI")}
                </Button>

                {showSimplified && (
                  <div className="space-y-3 pt-2">
                    <Label htmlFor="simplified" className="text-base font-semibold text-gray-900">
                      {t("alert.simplifiedTitle")}
                    </Label>
                    <p className="text-sm text-gray-500">{t("alert.simplifiedHelp")}</p>
                    <Textarea
                      id="simplified" className="min-h-40 text-base border-sky-500 bg-sky-50 text-gray-900"
                      value={simplifiedMessage}
                      onChange={(e) => setSimplifiedMessage(e.target.value)}
                    />
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-100">
                      <Sparkles className="w-4 h-4 text-sky-500" />
                      <p className="text-xs text-blue-900">{t("alert.simplifiedNote")}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-8" />

              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">
                  {t("alert.targetAreas")} <span className="text-red-600">*</span>
                </Label>
                <p className="text-sm text-gray-500">{t("alert.targetAreasHelp")}</p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <Checkbox id="select-all" checked={selectedVillages.length === villages.length} onCheckedChange={selectAllVillages} />
                    <label htmlFor="select-all" className="flex-1 font-semibold cursor-pointer text-gray-900">
                      {t("alert.allVillages", { count: totalMembers.toLocaleString() })}
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {villages.map((village) => (
                      <div
                        key={village.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg bg-white border ${selectedVillages.includes(village.id) ? "border-sky-500" : "border-gray-200"}`}
                      >
                        <Checkbox id={village.id} checked={selectedVillages.includes(village.id)} onCheckedChange={() => toggleVillage(village.id)} />
                        <label htmlFor={village.id} className="flex-1 cursor-pointer">
                          <div className="font-medium text-gray-900">{t(village.nameKey)}</div>
                          <div className="text-xs text-gray-500">
                            {village.members.toLocaleString()} {t("common.members")}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-lg bg-blue-100 border-l-4 border-l-blue-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 text-blue-900" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {t("alert.expectedRecipients")}: {expectedRecipients > 0 ? expectedRecipients.toLocaleString() : '0'} {t("common.communityMembers")}
                    </p>
                    <p className="text-sm mt-1 text-gray-500">
                      {selectedVillages.length === 0
                        ? t("alert.selectTargetPrompt")
                        : t("alert.smsSendInfo", { count: selectedVillages.length })
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" size="lg" className="text-base px-8 bg-red-600 text-white hover:bg-red-700" disabled={!message.trim() || selectedVillages.length === 0}>
                  <Send className="w-5 h-5 mr-2" />
                  {t("alert.sendButton")}
                </Button>
                <Button
                  type="button" variant="outline" size="lg"
                  className="border-gray-200 text-gray-500"
                  onClick={() => { setMessage(""); setSimplifiedMessage(""); setShowSimplified(false); setSelectedVillages([]); }}
                >
                  {t("alert.clearForm")}
                </Button>
              </div>

              <div className="p-4 rounded-lg bg-amber-100">
                <p className="text-sm text-amber-900">
                  ⚠️ <strong>{t("common.important")}:</strong> {t("alert.importantNotice")}
                </p>
              </div>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
