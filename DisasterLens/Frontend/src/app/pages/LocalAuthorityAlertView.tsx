import { AlertCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { useLanguage } from "../i18n/LanguageContext";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

type Village = {
  id: string;
  nameKey: string;
  members: number;
};

export function LocalAuthorityAlertView() {
  const { t, d } = useLanguage();
  const { token } = useAuth();
  const [villages, setVillages] = useState<Village[]>([]);
  const [message, setMessage] = useState("");
  const [simplifiedMessage, setSimplifiedMessage] = useState("");
  const [showSimplified, setShowSimplified] = useState(false);
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.get<Village[]>("/authority/villages", token);
        setVillages(data);
      } catch (error) {
        console.error("Failed to load villages", error);
      }
    };
    void loadData();
  }, []);

  const handleGenerateSimplified = () => {
    if (!message.trim()) return;
    setIsGenerating(true);
    void (async () => {
      try {
        const data = await api.post<{ message: string; messageBn: string }>("/authority/alerts/simplify", { message, messageBn: message }, token);
        setSimplifiedMessage(d(data.message, data.messageBn));
        setShowSimplified(true);
      } catch (error) {
        console.error("Failed to simplify message", error);
      } finally {
        setIsGenerating(false);
      }
    })();
  };

  const handleSendBroadcast = async () => {
    if (!message.trim() || selectedVillages.length === 0) {
      return;
    }
    await api.post(
      "/authority/alerts",
      {
        message,
        simplifiedMessage: showSimplified ? simplifiedMessage : undefined,
        villageIds: selectedVillages,
      },
      token,
    );
    setMessage("");
    setSimplifiedMessage("");
    setShowSimplified(false);
    setSelectedVillages([]);
  };

  const toggleVillage = (id: string) => {
    setSelectedVillages(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-semibold">{t("alert.title")}</h1>
          <p className="text-blue-200 mt-1">{t("alert.subtitle")}</p>
        </div>
      </header>

      <main className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("alert.formTitle")}</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="message">{t("alert.messageLabel")}</Label>
                <Textarea 
                  id="message" 
                  placeholder={t("alert.messagePlaceholder")}
                  className="min-h-[150px]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <p className="text-xs text-gray-500 text-right">{message.length} {t("common.characters")}</p>
              </div>

              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
                  onClick={handleGenerateSimplified}
                  disabled={isGenerating || !message.trim()}
                >
                  <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? "animate-pulse" : ""}`} />
                  {isGenerating ? t("alert.aiGenerating") : t("alert.aiSimplify")}
                </Button>
              </div>

              {showSimplified && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    {t("alert.aiSimplifiedTitle")}
                  </div>
                  <p className="text-orange-900 text-sm leading-relaxed mb-4">{simplifiedMessage}</p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => setMessage(simplifiedMessage)}
                  >
                    {t("alert.useSimplified")}
                  </Button>
                </div>
              )}

              <div className="pt-4 border-t">
                <Label className="mb-3 block">{t("alert.selectVillages")}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {villages.map((village) => (
                    <div key={village.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer" onClick={() => toggleVillage(village.id)}>
                      <Checkbox id={village.id} checked={selectedVillages.includes(village.id)} />
                      <Label htmlFor={village.id} className="text-sm cursor-pointer">{t(village.nameKey)}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-blue-900 h-12 text-lg" onClick={handleSendBroadcast}>
                <Send className="w-5 h-5 mr-2" />
                {t("alert.sendBroadcast")}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              {t("alert.previewTitle")}
            </h2>
            
            <div className="bg-white text-black p-4 rounded-xl shadow-inner mb-6 min-h-[120px] max-w-[300px] mx-auto relative">
              <div className="text-[10px] text-gray-500 mb-1">SMS: ResilienceAI</div>
              <p className="text-sm font-medium">{message || t("alert.previewEmpty")}</p>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rotate-45 border-b border-l border-gray-100"></div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm">
              <p className="flex justify-between border-b border-slate-700 pb-2">
                <span>{t("alert.targetAudience")}:</span>
                <span className="text-white font-medium">{selectedVillages.length} {t("common.villages")}</span>
              </p>
              <p className="flex justify-between border-b border-slate-700 pb-2">
                <span>{t("alert.estimatedReach")}:</span>
                <span className="text-white font-medium">~2,450 {t("common.members")}</span>
              </p>
              <p className="flex justify-between border-b border-slate-700 pb-2">
                <span>{t("alert.deliveryMethod")}:</span>
                <span className="text-white font-medium">SMS + App Notification</span>
              </p>
            </div>

            <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-xs italic text-slate-400">
                {t("alert.smsNotice")}
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
