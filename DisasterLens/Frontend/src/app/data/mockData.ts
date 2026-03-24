// ──────────────────────────────────────────────────────────────
// Centralized mock data for all pages and components.
// When the backend is ready, replace each export with an API
// call (e.g. via React Query) — the UI imports stay the same.
// ──────────────────────────────────────────────────────────────

import type {
  Village, VillageStatus, Task, RecentTask, Volunteer, VolunteerOption,
  CommunityResponse, SilentCommunity, Member, AlertItem,
} from "../types";

// ── Villages ─────────────────────────────────────────────────

export const villages: Village[] = [
  { id: "dakshin", nameKey: "village.dakshinPara", members: 428 },
  { id: "madhya", nameKey: "village.madhyaGram", members: 512 },
  { id: "char", nameKey: "village.charJanajat", members: 345 },
  { id: "uttar", nameKey: "village.uttarPara", members: 398 },
  { id: "paschim", nameKey: "village.paschimBazar", members: 467 },
  { id: "purba", nameKey: "village.purbaGhoshPara", members: 397 },
];

export const villageStatusData: VillageStatus[] = [
  { villageName: "Dakshin Para", villageNameBn: "দক্ষিণ পাড়া", safe: 342, needHelp: 12, needRescue: 3, noResponse: 18 },
  { villageName: "Madhya Gram", villageNameBn: "মধ্য গ্রাম", safe: 289, needHelp: 8, needRescue: 0, noResponse: 25 },
  { villageName: "Char Janajat", villageNameBn: "চর জনজাত", safe: 18, needHelp: 5, needRescue: 0, noResponse: 427 },
  { villageName: "Uttar Para", villageNameBn: "উত্তর পাড়া", safe: 12, needHelp: 3, needRescue: 0, noResponse: 305 },
  { villageName: "Paschim Bazar", villageNameBn: "পশ্চিম বাজার", safe: 412, needHelp: 15, needRescue: 2, noResponse: 31 },
  { villageName: "Purba Ghosh Para", villageNameBn: "পূর্ব ঘোষ পাড়া", safe: 278, needHelp: 6, needRescue: 1, noResponse: 22 },
];

// ── Tasks ────────────────────────────────────────────────────

export const mockTasks: Task[] = [
  { id: "T001", title: "Deliver relief supplies to Char Janajat", titleBn: "চর জনজাতে ত্রাণ সামগ্রী পৌঁছে দিন", type: "Relief Distribution", typeBn: "ত্রাণ বিতরণ", priority: "critical", location: "Char Janajat", locationBn: "চর জনজাত", assignedTo: ["Aminul Islam", "Shahida Akter", "Rahim Uddin"], assignedToBn: ["আমিনুল ইসলাম", "শাহিদা আক্তার", "রহিম উদ্দিন"], status: "in-progress", progress: 65, deadline: "Today, 5:00 PM", deadlineBn: "আজ, ৫:০০ PM", description: "Distribute food packages and water bottles to 50 families in flood-affected area", startTime: "Today, 2:00 PM", equipmentNeeded: ["Relief packages", "Transport vehicle", "Mobile phone"] },
  { id: "T002", title: "Field assessment of flood damage in Uttar Para", titleBn: "উত্তর পাড়ায় বন্যার ক্ষয়ক্ষতির মাঠ মূল্যায়ন", type: "Field Assessment", typeBn: "মাঠ মূল্যায়ন", priority: "high", location: "Uttar Para", locationBn: "উত্তর পাড়া", assignedTo: "Shahida Akter", assignedToBn: "শাহিদা আক্তার", status: "assigned", progress: 0, deadline: "Today, 6:00 PM", deadlineBn: "আজ, ৬:০০ PM", description: "Assess flood damage to houses and infrastructure", startTime: "Today, 4:00 PM", equipmentNeeded: ["Camera", "Assessment form", "Notebook"] },
  { id: "T003", title: "Medical aid camp setup at Union Parishad Complex", titleBn: "ইউনিয়ন পরিষদ কমপ্লেক্সে চিকিৎসা সেবা ক্যাম্প স্থাপন", type: "Medical Aid", typeBn: "চিকিৎসা সেবা", priority: "critical", location: "Union Parishad Complex", locationBn: "ইউনিয়ন পরিষদ কমপ্লেক্স", assignedTo: ["Rahim Uddin", "Kulsum Begum"], assignedToBn: ["রহিম উদ্দিন", "কুলসুম বেগম"], status: "in-progress", progress: 80, deadline: "Today, 3:00 PM", deadlineBn: "আজ, ৩:০০ PM", description: "Set up medical camp with doctor", startTime: "Today, 10:00 AM", equipmentNeeded: ["First aid kits", "Medicines", "Tables and chairs"] },
  { id: "T004", title: "Evacuation support for elderly residents", titleBn: "বয়স্ক বাসিন্দাদের সরিয়ে নেওয়ার সহায়তা", type: "Evacuation Support", typeBn: "সরিয়ে নেওয়ার সহায়তা", priority: "critical", location: "Dakshin Para", locationBn: "দক্ষিণ পাড়া", assignedTo: ["Kulsum Begum", "Habibur Rahman"], assignedToBn: ["কুলসুম বেগম", "হাবিবুর রহমান"], status: "completed", progress: 100, deadline: "Today, 12:00 PM", deadlineBn: "আজ, ১২:০০ PM", description: "Assist elderly residents in moving to shelter", startTime: "Today, 9:00 AM", equipmentNeeded: ["Transport vehicle", "Wheelchair"] },
  { id: "T005", title: "Communication support - door to door alert", titleBn: "যোগাযোগ সহায়তা - বাড়ি বাড়ি সতর্কতা", type: "Communication Support", typeBn: "যোগাযোগ সহায়তা", priority: "high", location: "Paschim Bazar", locationBn: "পশ্চিম বাজার", assignedTo: "Habibur Rahman", assignedToBn: "হাবিবুর রহমান", status: "pending", progress: 0, deadline: "Tomorrow, 10:00 AM", deadlineBn: "আগামীকাল, ১০:০০ AM", description: "Visit households and inform about heavy rainfall", startTime: "Tomorrow, 8:00 AM", equipmentNeeded: ["Megaphone", "Alert pamphlets"] },
  { id: "T006", title: "Rescue support near Padma river area", titleBn: "পদ্মা নদী এলাকায় উদ্ধার সহায়তা", type: "Rescue Support", typeBn: "উদ্ধার সহায়তা", priority: "medium", location: "Madhya Gram", locationBn: "মধ্য গ্রাম", assignedTo: ["Roksana Parvin", "Khalid Hasan"], assignedToBn: ["রোকসানা পারভিন", "খালিদ হাসান"], status: "overdue", progress: 40, deadline: "Yesterday, 4:00 PM", deadlineBn: "গতকাল, ৪:০০ PM", description: "Support rescue team in evacuating stranded families", startTime: "Yesterday, 2:00 PM", equipmentNeeded: ["Life jackets", "Ropes", "Emergency kit"] },
];

export const recentTasks: RecentTask[] = [
  { id: "T001", title: "Deliver relief supplies to Char Janajat", titleBn: "চর জনজাতে ত্রাণ সামগ্রী পৌঁছে দিন", priority: "critical", assignedTo: "Aminul Islam", assignedToBn: "আমিনুল ইসলাম", status: "in-progress" },
  { id: "T002", title: "Field assessment of flood damage", titleBn: "বন্যার ক্ষয়ক্ষতির মাঠ পর্যায়ের মূল্যায়ন", priority: "high", assignedTo: "Shahida Akter", assignedToBn: "শাহিদা আক্তার", status: "assigned" },
  { id: "T003", title: "Medical aid camp setup", titleBn: "চিকিৎসা সেবা ক্যাম্প স্থাপন", priority: "critical", assignedTo: "Rahim Uddin", assignedToBn: "রহিম উদ্দিন", status: "in-progress" },
];

// ── Volunteers ───────────────────────────────────────────────

export const volunteers: Volunteer[] = [
  { name: "Aminul Islam", nameBn: "আমিনুল ইসলাম", phone: "+880 1712-111222", assignedArea: "Dakshin Para", assignedAreaBn: "দক্ষিণ পাড়া", tasksCompleted: 12, status: "active" },
  { name: "Shahida Akter", nameBn: "শাহিদা আক্তার", phone: "+880 1823-222333", assignedArea: "Char Janajat", assignedAreaBn: "চর জনজাত", tasksCompleted: 8, status: "active" },
  { name: "Rahim Uddin", nameBn: "রহিম উদ্দিন", phone: "+880 1934-333444", assignedArea: "Madhya Gram", assignedAreaBn: "মধ্য গ্রাম", tasksCompleted: 15, status: "active" },
  { name: "Kulsum Begum", nameBn: "কুলসুম বেগম", phone: "+880 1745-444555", assignedArea: "Uttar Para", assignedAreaBn: "উত্তর পাড়া", tasksCompleted: 6, status: "active" },
  { name: "Habibur Rahman", nameBn: "হাবিবুর রহমান", phone: "+880 1856-555666", assignedArea: "Paschim Bazar", assignedAreaBn: "পশ্চিম বাজার", tasksCompleted: 10, status: "available" },
  { name: "Roksana Parvin", nameBn: "রোকসানা পারভিন", phone: "+880 1967-666777", assignedArea: "Not Assigned", assignedAreaBn: "নির্ধারিত নয়", tasksCompleted: 4, status: "available" },
  { name: "Khalid Hasan", nameBn: "খালিদ হাসান", phone: "+880 1778-777888", assignedArea: "Purba Ghosh Para", assignedAreaBn: "পূর্ব ঘোষ পাড়া", tasksCompleted: 9, status: "off-duty" },
];

export const volunteerOptions: VolunteerOption[] = [
  { id: "v1", name: "Aminul Islam", nameBn: "আমিনুল ইসলাম", status: "available" },
  { id: "v2", name: "Shahida Akter", nameBn: "শাহিদা আক্তার", status: "active" },
  { id: "v3", name: "Rahim Uddin", nameBn: "রহিম উদ্দিন", status: "available" },
  { id: "v4", name: "Kulsum Begum", nameBn: "কুলসুম বেগম", status: "active" },
  { id: "v5", name: "Habibur Rahman", nameBn: "হাবিবুর রহমান", status: "available" },
  { id: "v6", name: "Roksana Parvin", nameBn: "রোকসানা পারভিন", status: "available" },
  { id: "v7", name: "Khalid Hasan", nameBn: "খালিদ হাসান", status: "off-duty" },
];

// ── Community ────────────────────────────────────────────────

export const communityResponses: CommunityResponse[] = [
  { name: "Kamal Hossain", nameBn: "কামাল হোসেন", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1712-345678", status: "safe", lastResponse: "2 hours ago", lastResponseBn: "২ ঘণ্টা আগে" },
  { name: "Fatima Begum", nameBn: "ফাতেমা বেগম", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1823-456789", status: "safe", lastResponse: "1 hour ago", lastResponseBn: "১ ঘণ্টা আগে" },
  { name: "Abdul Rahman", nameBn: "আব্দুল রহমান", village: "Char Janajat", villageBn: "চর জনজাত", phone: "+880 1934-567890", status: "help", lastResponse: "30 min ago", lastResponseBn: "৩০ মিনিট আগে" },
  { name: "Rahima Khatun", nameBn: "রহিমা খাতুন", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1745-678901", status: "rescue", lastResponse: "15 min ago", lastResponseBn: "১৫ মিনিট আগে" },
  { name: "Mohammad Ali", nameBn: "মোহাম্মদ আলী", village: "Uttar Para", villageBn: "উত্তর পাড়া", phone: "+880 1856-789012", status: "no-response", lastResponse: "Never", lastResponseBn: "কখনো নয়" },
  { name: "Nasima Akter", nameBn: "নাসিমা আক্তার", village: "Paschim Bazar", villageBn: "পশ্চিম বাজার", phone: "+880 1967-890123", status: "safe", lastResponse: "3 hours ago", lastResponseBn: "৩ ঘণ্টা আগে" },
  { name: "Jamal Uddin", nameBn: "জামাল উদ্দিন", village: "Purba Ghosh Para", villageBn: "পূর্ব ঘোষ পাড়া", phone: "+880 1778-901234", status: "help", lastResponse: "45 min ago", lastResponseBn: "৪৫ মিনিট আগে" },
  { name: "Salma Begum", nameBn: "সালমা বেগম", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1889-012345", status: "safe", lastResponse: "1 hour ago", lastResponseBn: "১ ঘণ্টা আগে" },
];

export const silentCommunities: SilentCommunity[] = [
  { villageName: "Char Janajat", villageNameBn: "চর জনজাত", populationContacted: 450, responsesReceived: 23 },
  { villageName: "Uttar Para", villageNameBn: "উত্তর পাড়া", populationContacted: 320, responsesReceived: 15 },
];

// ── Members ──────────────────────────────────────────────────

export const members: Member[] = [
  { id: "CM001", name: "Kamal Hossain", nameBn: "কামাল হোসেন", age: 45, gender: "Male", genderBn: "পুরুষ", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1712-345678", household: "HH-001" },
  { id: "CM002", name: "Fatima Begum", nameBn: "ফাতেমা বেগম", age: 38, gender: "Female", genderBn: "মহিলা", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1823-456789", household: "HH-002" },
  { id: "CM003", name: "Abdul Rahman", nameBn: "আব্দুল রহমান", age: 52, gender: "Male", genderBn: "পুরুষ", village: "Char Janajat", villageBn: "চর জনজাত", phone: "+880 1934-567890", household: "HH-003" },
  { id: "CM004", name: "Rahima Khatun", nameBn: "রহিমা খাতুন", age: 29, gender: "Female", genderBn: "মহিলা", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1745-678901", household: "HH-004" },
  { id: "CM005", name: "Mohammad Ali", nameBn: "মোহাম্মদ আলী", age: 61, gender: "Male", genderBn: "পুরুষ", village: "Uttar Para", villageBn: "উত্তর পাড়া", phone: "+880 1856-789012", household: "HH-005" },
  { id: "CM006", name: "Nasima Akter", nameBn: "নাসিমা আক্তার", age: 34, gender: "Female", genderBn: "মহিলা", village: "Paschim Bazar", villageBn: "পশ্চিম বাজার", phone: "+880 1967-890123", household: "HH-006" },
  { id: "CM007", name: "Jamal Uddin", nameBn: "জামাল উদ্দিন", age: 47, gender: "Male", genderBn: "পুরুষ", village: "Purba Ghosh Para", villageBn: "পূর্ব ঘোষ পাড়া", phone: "+880 1778-901234", household: "HH-007" },
  { id: "CM008", name: "Salma Begum", nameBn: "সালমা বেগম", age: 42, gender: "Female", genderBn: "মহিলা", village: "Madhya Gram", villageBn: "মধ্য গ্রাম", phone: "+880 1889-012345", household: "HH-008" },
  { id: "CM009", name: "Ruhul Amin", nameBn: "রুহুল আমিন", age: 55, gender: "Male", genderBn: "পুরুষ", village: "Dakshin Para", villageBn: "দক্ষিণ পাড়া", phone: "+880 1990-123456", household: "HH-009" },
  { id: "CM010", name: "Shapla Khatun", nameBn: "শাপলা খাতুন", age: 26, gender: "Female", genderBn: "মহিলা", village: "Char Janajat", villageBn: "চর জনজাত", phone: "+880 1701-234567", household: "HH-010" },
];

// ── Alerts ────────────────────────────────────────────────────

export const alertTimelineData: AlertItem[] = [
  { headline: "Flood risk near Padma river area", headlineBn: "পদ্মা নদী এলাকায় বন্যার ঝুঁকি", description: "Water levels rising rapidly. Residents in low-lying areas should move to higher ground immediately.", descriptionBn: "পানির স্তর দ্রুত বাড়ছে। নিচু এলাকার বাসিন্দাদের অবিলম্বে উঁচু স্থানে যাওয়া উচিত।", timestamp: "10:15 AM", timestampBn: "১০:১৫ AM" },
  { headline: "Heavy rainfall expected tonight", headlineBn: "আজ রাতে ভারী বৃষ্টিপাতের সম্ভাবনা", description: "Meteorological department forecasts 150mm rainfall. Please stay indoors and avoid travel.", descriptionBn: "আবহাওয়া বিভাগ ১৫০ মিমি বৃষ্টিপাতের পূর্বাভাস দিয়েছে। অনুগ্রহ করে ঘরে থাকুন এবং ভ্রমণ এড়িয়ে চলুন।", timestamp: "6:30 PM", timestampBn: "৬:৩০ PM" },
  { headline: "Evacuation order for Char Janajat", headlineBn: "চর জনজাতের জন্য সরিয়ে নেওয়ার নির্দেশ", description: "Mandatory evacuation ordered due to flood risk. Proceed to the nearest shelter immediately.", descriptionBn: "বন্যার ঝুঁকির কারণে বাধ্যতামূলক সরিয়ে নেওয়ার নির্দেশ। অবিলম্বে নিকটতম আশ্রয়কেন্দ্রে যান।", timestamp: "Yesterday, 3:45 PM", timestampBn: "গতকাল, ৩:৪৫ PM" },
  { headline: "Emergency shelter opened at Union Parishad Complex", headlineBn: "ইউনিয়ন পরিষদ কমপ্লেক্সে জরুরি আশ্রয়কেন্দ্র খোলা হয়েছে", description: "Shelter facilities now available with food, water, and medical support.", descriptionBn: "খাবার, পানি এবং চিকিৎসা সহায়তাসহ আশ্রয়কেন্দ্র এখন উন্মুক্ত।", timestamp: "Yesterday, 2:20 PM", timestampBn: "গতকাল, ২:২০ PM" },
];
