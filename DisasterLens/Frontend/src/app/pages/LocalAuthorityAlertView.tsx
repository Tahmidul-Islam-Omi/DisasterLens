import { AlertCircle, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useLanguage } from "../i18n/LanguageContext";
import { ApiError, api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

type NoticeState = {
  type: "success" | "error";
  text: string;
} | null;

export function LocalAuthorityAlertView() {
  const { t, d } = useLanguage();
  const { token, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [simplifiedMessage, setSimplifiedMessage] = useState("");
  const [showSimplified, setShowSimplified] = useState(false);
  const [previewMode, setPreviewMode] = useState<"original" | "simplified">("original");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);

  const previewRawMessage =
    previewMode === "simplified"
      ? showSimplified
        ? simplifiedMessage
        : ""
      : message;
  const previewCharCount = previewRawMessage.trim().length;
  const previewSegments = previewCharCount === 0 ? 0 : Math.ceil(previewCharCount / 160);
  const previewDisplayMessage = previewRawMessage.trim()
    ? previewRawMessage
    : previewMode === "simplified"
      ? t("alert.previewSimplifiedHint")
      : t("alert.previewEmptyNotify");
  const previewStatusKey = isSending
    ? "alert.previewStatusSending"
    : previewCharCount > 0
      ? "alert.previewStatusReady"
      : "alert.previewStatusDraft";
  const previewStatusStyle = isSending
    ? "bg-blue-500"
    : previewCharCount > 0
      ? "bg-emerald-500"
      : "bg-amber-500";

  const handleGenerateSimplified = () => {
    if (!message.trim()) return;

    setIsGenerating(true);
    setNotice(null);

    void (async () => {
      try {
        const data = await api.post<{ message: string; messageBn: string }>(
          "/authority/alerts/simplify",
          { message, messageBn: message },
          token,
        );

        setSimplifiedMessage(d(data.message, data.messageBn));
        setShowSimplified(true);
        setPreviewMode("simplified");
        setNotice({
          type: "success",
          text: t("alert.simplifySuccess"),
        });
      } catch (error) {
        console.error("Failed to simplify message", error);
        if (error instanceof ApiError && error.status === 401) {
          logout();
          return;
        }
        setNotice({ type: "error", text: t("alert.simplifyError") });
      } finally {
        setIsGenerating(false);
      }
    })();
  };

  const handleSendBroadcast = async () => {
    if (!message.trim()) {
      setNotice({ type: "error", text: t("alert.messageRequiredBeforeSend") });
      return;
    }

    setIsSending(true);
    setNotice(null);

    try {
      const payload = {
        message,
        simplifiedMessage: showSimplified ? simplifiedMessage : undefined,
      };

      const response = await api.post<{
        status: string;
        requestId: string;
        recipientCount?: number;
        sentCount?: number;
      }>(
        "/authority/alerts",
        payload,
        token,
      );

      setNotice({
        type: "success",
        text: t("alert.sendSuccess", {
          requestId: response.requestId,
          status: response.status,
          payloadChars: payload.message.length,
        }),
      });

      setMessage("");
      setSimplifiedMessage("");
      setShowSimplified(false);
      setPreviewMode("original");
    } catch (error) {
      console.error("Failed to send notification", error);
      if (error instanceof ApiError && error.status === 401) {
        logout();
        return;
      }
      setNotice({ type: "error", text: t("alert.sendError") });
    } finally {
      setIsSending(false);
    }
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{t("alert.composeCommunityTitle")}</h2>
            
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
                  aria-label={t("alert.simplifyMsgButton")}
                >
                  <Sparkles className={`w-4 h-4 mr-2 ${isGenerating ? "animate-pulse" : ""}`} />
                  {isGenerating ? t("alert.generatingShort") : t("alert.simplifyMsgButton")}
                </Button>
              </div>

              {showSimplified && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2 text-orange-800 font-medium mb-2">
                    <Sparkles className="w-4 h-4" />
                    {t("alert.aiSimplifiedMessageTitle")}
                  </div>
                  <p className="text-orange-900 text-sm leading-relaxed mb-4">{simplifiedMessage}</p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => setMessage(simplifiedMessage)}
                  >
                    {t("alert.useSimplifiedMessage")}
                  </Button>
                </div>
              )}

              <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                {t("alert.unionAutoTargetNote")}
              </div>

              <Button
                className="w-full bg-blue-900 h-12 text-lg"
                onClick={handleSendBroadcast}
                disabled={isSending || !message.trim()}
                aria-label={t("alert.sendButtonShort")}
              >
                <Send className="w-5 h-5 mr-2" />
                {isSending ? t("alert.sendingShort") : t("alert.sendButtonShort")}
              </Button>

              {notice && (
                <div
                  className={`rounded-lg border p-3 text-sm ${
                    notice.type === "success"
                      ? "border-green-200 bg-green-50 text-green-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  {notice.text}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-slate-900 text-white">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              {t("alert.smsPreviewTitle")}
            </h2>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode("original")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  previewMode === "original"
                    ? "border-blue-300 bg-blue-600 text-white"
                    : "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {t("alert.previewModeOriginal")}
              </button>
              <button
                type="button"
                onClick={() => showSimplified && setPreviewMode("simplified")}
                disabled={!showSimplified}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  previewMode === "simplified" && showSimplified
                    ? "border-orange-300 bg-orange-600 text-white"
                    : "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                } ${!showSimplified ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {t("alert.previewModeSimplified")}
              </button>
            </div>

            <div className="mb-4 rounded-lg border border-slate-700 bg-slate-800 p-3 text-xs text-slate-200">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${previewStatusStyle}`}></span>
                  {t("alert.previewStatusLabel")}:
                </span>
                <span className="font-semibold">{t(previewStatusKey)}</span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                <span>{t("alert.previewCharactersLabel")}: {previewCharCount}</span>
                <span>{t("alert.previewSegmentsLabel")}: {previewSegments}</span>
                <span>{t("alert.previewUpdatedLabel")}: {t("alert.previewNow")}</span>
              </div>
            </div>
            
            <div className="bg-white text-black p-4 rounded-xl shadow-inner mb-6 min-h-[120px] max-w-[300px] mx-auto relative">
              <div className="text-[10px] text-gray-500 mb-1">{t("alert.smsSenderLabel", { sender: "ResilienceAI" })}</div>
              <p className="text-sm font-medium">{previewDisplayMessage}</p>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rotate-45 border-b border-l border-gray-100"></div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm">
              <p className="flex justify-between border-b border-slate-700 pb-2">
                <span>{t("alert.targetAudienceLabel")}:</span>
                <span className="text-white font-medium">{t("alert.targetAudienceUnionMembers")}</span>
              </p>
              <p className="flex justify-between border-b border-slate-700 pb-2">
                <span>{t("alert.estimatedReachLabel")}:</span>
                <span className="text-white font-medium">{t("alert.estimatedReachAuto")}</span>
              </p>
              <p className="flex justify-between border-b border-slate-700 pb-2">
                <span>{t("alert.deliveryMethodLabel")}:</span>
                <span className="text-white font-medium">{t("alert.deliveryMethodSmsApp")}</span>
              </p>
            </div>

            <div className="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-xs italic text-slate-400">
                {t("alert.frontendOnlyNotice")}
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
