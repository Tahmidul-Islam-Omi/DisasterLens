import { AlertTriangle, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { useLanguage } from "../i18n/LanguageContext";

interface Alert {
  headline: string;
  headlineBn: string;
  description: string;
  descriptionBn: string;
  timestamp: string;
  timestampBn: string;
}

const alerts: Alert[] = [
  {
    headline: "Flood risk near Padma river area",
    headlineBn: "পদ্মা নদী এলাকায় বন্যার ঝুঁকি",
    description: "Water levels rising rapidly. Residents in low-lying areas should move to higher ground immediately.",
    descriptionBn: "পানির স্তর দ্রুত বাড়ছে। নিচু এলাকার বাসিন্দাদের অবিলম্বে উঁচু স্থানে যাওয়া উচিত।",
    timestamp: "10:15 AM",
    timestampBn: "১০:১৫ AM",
  },
  {
    headline: "Heavy rainfall expected tonight",
    headlineBn: "আজ রাতে ভারী বৃষ্টিপাতের সম্ভাবনা",
    description: "Meteorological department forecasts 150mm rainfall. Please stay indoors and avoid travel.",
    descriptionBn: "আবহাওয়া বিভাগ ১৫০ মিমি বৃষ্টিপাতের পূর্বাভাস দিয়েছে। অনুগ্রহ করে ঘরে থাকুন এবং ভ্রমণ এড়িয়ে চলুন।",
    timestamp: "6:30 PM",
    timestampBn: "৬:৩০ PM",
  },
  {
    headline: "Evacuation order for Char Janajat",
    headlineBn: "চর জনজাতের জন্য সরিয়ে নেওয়ার নির্দেশ",
    description: "Mandatory evacuation ordered due to flood risk. Proceed to the nearest shelter immediately.",
    descriptionBn: "বন্যার ঝুঁকির কারণে বাধ্যতামূলক সরিয়ে নেওয়ার নির্দেশ। অবিলম্বে নিকটতম আশ্রয়কেন্দ্রে যান।",
    timestamp: "Yesterday, 3:45 PM",
    timestampBn: "গতকাল, ৩:৪৫ PM",
  },
  {
    headline: "Emergency shelter opened at Union Parishad Complex",
    headlineBn: "ইউনিয়ন পরিষদ কমপ্লেক্সে জরুরি আশ্রয়কেন্দ্র খোলা হয়েছে",
    description: "Shelter facilities now available with food, water, and medical support.",
    descriptionBn: "খাবার, পানি এবং চিকিৎসা সহায়তাসহ আশ্রয়কেন্দ্র এখন উন্মুক্ত।",
    timestamp: "Yesterday, 2:20 PM",
    timestampBn: "গতকাল, ২:২০ PM",
  },
];

export function AlertTimeline() {
  const { t, d } = useLanguage();

  return (
    <Card>
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">{t("alertTimeline.title")}</h3>

        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div key={index} className="border-l-4 border-l-orange-500 bg-orange-50 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg mt-1">
                  <AlertTriangle className="w-5 h-5 text-orange-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{d(alert.headline, alert.headlineBn)}</h4>
                  <p className="text-sm text-gray-700 mb-2">{d(alert.description, alert.descriptionBn)}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{t("common.published")}: {d(alert.timestamp, alert.timestampBn)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
