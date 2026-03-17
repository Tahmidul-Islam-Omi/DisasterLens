import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          dashboard: "Dashboard",
          map: "Interactive Map",
          reports: "Active Reports",
          settings: "Settings",
          help: "Help",
          login: "Login",
          welcome: "Welcome back. Here's what's happening in your area.",
          active_disasters: "Active Disasters",
          verified_reports: "Verified Reports",
          response_teams: "Response Teams",
          live_feed: "Live Feed",
          see_all: "See all",
          critical: "Critical",
          flood_alert: "Flash Flood Alert: Dhaka East",
          reported_mins: "Reported {{n}} mins ago by {{s}} sources",
        }
      },
      bn: {
        translation: {
          dashboard: "ড্যাশবোর্ড",
          map: "ইন্টারঅ্যাক্টিভ ম্যাপ",
          reports: "সক্রিয় রিপোর্ট",
          settings: "সেটিংস",
          help: "সহায়তা",
          login: "লগইন",
          welcome: "স্বাগতম। আপনার এলাকায় বর্তমান পরিস্থিতি এখানে দেখুন।",
          active_disasters: "সক্রিয় দুর্যোগ",
          verified_reports: "যাচাইকৃত রিপোর্ট",
          response_teams: "রেসপন্স টিম",
          live_feed: "লাইভ ফিড",
          see_all: "সব দেখুন",
          critical: "জরুরী",
          flood_alert: "আকস্মিক বন্যা সতর্কতা: ঢাকা পূর্ব",
          reported_mins: "{{n}} মিনিট আগে {{s}}টি সূত্র থেকে রিপোর্ট করা হয়েছে",
        }
      }
    }
  });

export default i18n;
