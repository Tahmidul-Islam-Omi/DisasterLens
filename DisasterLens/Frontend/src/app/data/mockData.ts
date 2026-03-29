// ──────────────────────────────────────────────────────────────
// Centralized mock data for all pages and components.
// When the backend is ready, replace each export with an API
// call (e.g. via React Query) — the UI imports stay the same.
// ──────────────────────────────────────────────────────────────

import type {
  MissingPerson,
  WeatherAlert,
  WeatherForecast,
  DistrictWeather,
  Incident,
  Volunteer,
  VolunteerTeam,
  Infrastructure,
  VulnerableCommunity,
  Query,
  Authority,
  RiskArea,
  Village,
  VillageStatus,
  Task,
  RecentTask,
  VolunteerOption,
  CommunityResponse,
  SilentCommunity,
  Member,
  AlertItem,
} from "../types";

// ── Missing Persons ──────────────────────────────────────────

export const mockMissingPersons: MissingPerson[] = [
  {
    id: 1,
    name: "Ayesha Begum",
    nameBn: "আয়েশা বেগম",
    age: 34,
    lastSeen: "Sylhet Sadar, Zone A",
    lastSeenBn: "সিলেট সদর, জোন এ",
    date: "2023-10-24 14:30",
    dateBn: "২০২৩-১০-২৪ ১৪:৩০",
    status: "Possible Match",
    statusBn: "সম্ভাব্য মিল",
    score: 94,
    phone: "+880 1711-000000",
    img: "https://images.unsplash.com/photo-1705940372495-ab4ed45d3102?w=500&q=80",
  },
  {
    id: 2,
    name: "Unknown Sighting",
    nameBn: "অজানা দেখা",
    age: 30,
    lastSeen: "Netrokona Camp 2",
    lastSeenBn: "নেত্রকোনা ক্যাম্প ২",
    date: "2023-10-25 09:15",
    dateBn: "২০২৩-১০-২৫ ০৯:১৫",
    status: "Unverified Sighting",
    statusBn: "অযাচাইকৃত দেখা",
    score: 88,
    phone: "Camp Admin: +880 1812-111111",
    img: "https://images.unsplash.com/photo-1748200100199-fed2be4c31eb?w=500&q=80",
  },
  {
    id: 3,
    name: "Fatima",
    nameBn: "ফাতিমা",
    age: 36,
    lastSeen: "Sunamganj Sector 3",
    lastSeenBn: "সুনামগঞ্জ সেক্টর ৩",
    date: "2023-10-23 18:00",
    dateBn: "২০২৩-১০-২৩ ১৮:০০",
    status: "Reported Missing",
    statusBn: "নিখোঁজ রিপোর্ট",
    score: 82,
    phone: "+880 1913-222222",
    img: "https://images.unsplash.com/photo-1647980188230-acfc89a718bb?w=500&q=80",
  },
  {
    id: 4,
    name: "Unidentified Female",
    nameBn: "অজ্ঞাত মহিলা",
    age: 35,
    lastSeen: "Habiganj Center",
    lastSeenBn: "হবিগঞ্জ কেন্দ্র",
    date: "2023-10-25 11:45",
    dateBn: "২০২৩-১০-২৫ ১১:৪৫",
    status: "Rescued / Safe",
    statusBn: "উদ্ধার / নিরাপদ",
    score: 76,
    phone: "Hospital Desk: +880 1614-333333",
    img: "https://images.unsplash.com/flagged/photo-1579924711789-872f06ecf220?w=500&q=80",
  },
  {
    id: 5,
    name: "Rina Akhtar",
    nameBn: "রিনা আখতার",
    age: 32,
    lastSeen: "Moulvibazar Route",
    lastSeenBn: "মৌলভীবাজার রুট",
    date: "2023-10-22 16:20",
    dateBn: "২০২৩-১০-২২ ১৬:২০",
    status: "Possible Match",
    statusBn: "সম্ভাব্য মিল",
    score: 71,
    phone: "+880 1715-444444",
    img: "https://images.unsplash.com/photo-1561165804-4ec46664a4cb?w=500&q=80",
  },
];

// ── Weather Alerts ───────────────────────────────────────────

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: "WA001",
    headline: "Heavy Rainfall Warning",
    headlineBn: "ভারী বৃষ্টিপাতের সতর্কতা",
    description: "Intense rainfall expected across northern districts. Flooding likely in low-lying areas.",
    descriptionBn: "উত্তরাঞ্চলীয় জেলাগুলিতে তীব্র বৃষ্টিপাতের প্রত্যাশা। নিচু এলাকায় বন্যার সম্ভাবনা।",
    severity: "warning",
    category: "Heavy Rainfall",
    categoryBn: "ভারী বৃষ্টিপাত",
    region: "Northern Bangladesh",
    regionBn: "উত্তর বাংলাদেশ",
    timeIssued: "2 hours ago",
    timeIssuedBn: "২ ঘণ্টা আগে",
    status: "active",
    publishedDate: "2024-01-15",
  },
  {
    id: "WA002",
    headline: "Cyclone Alert",
    headlineBn: "ঘূর্ণিঝড় সতর্কতা",
    description: "Tropical cyclone approaching coastal regions. Evacuations recommended.",
    descriptionBn: "উপকূলীয় অঞ্চলে ক্রান্তীয় ঘূর্ণিঝড় আসছে। সরিয়ে নেওয়ার সুপারিশ করা হয়েছে।",
    severity: "emergency",
    category: "Cyclone Warning",
    categoryBn: "ঘূর্ণিঝড় সতর্কতা",
    region: "Coastal Areas",
    regionBn: "উপকূলীয় এলাকা",
    timeIssued: "30 minutes ago",
    timeIssuedBn: "৩০ মিনিট আগে",
    status: "active",
    publishedDate: "2024-01-15",
  },
  {
    id: "WA003",
    headline: "Flood Risk Advisory",
    headlineBn: "বন্যা ঝুঁকি পরামর্শ",
    description: "River levels rising. Monitor situation closely.",
    descriptionBn: "নদীর পানির স্তর বৃদ্ধি পাচ্ছে। পরিস্থিতি ঘনিষ্ঠভাবে পর্যবেক্ষণ করুন।",
    severity: "information",
    category: "Flood Risk",
    categoryBn: "বন্যা ঝুঁকি",
    region: "Central Bangladesh",
    regionBn: "মধ্য বাংলাদেশ",
    timeIssued: "5 hours ago",
    timeIssuedBn: "৫ ঘণ্টা আগে",
    status: "monitoring",
    publishedDate: "2024-01-15",
  },
];

// ── Weather Forecast ─────────────────────────────────────────

export const mockWeatherForecast: WeatherForecast[] = [
  { day: "Mon", dayBn: "সোম", condition: "Rainy", conditionBn: "বৃষ্টি", high: 32, low: 26 },
  { day: "Tue", dayBn: "মঙ্গল", condition: "Cloudy", conditionBn: "মেঘলা", high: 31, low: 25 },
  { day: "Wed", dayBn: "বুধ", condition: "Sunny", conditionBn: "রৌদ্রোজ্জ্বল", high: 33, low: 27 },
  { day: "Thu", dayBn: "বৃহঃ", condition: "Partly Cloudy", conditionBn: "আংশিক মেঘলা", high: 32, low: 26 },
  { day: "Fri", dayBn: "শুক্র", condition: "Light Rain", conditionBn: "হালকা বৃষ্টি", high: 30, low: 24 },
  { day: "Sat", dayBn: "শনি", condition: "Rainy", conditionBn: "বৃষ্টি", high: 29, low: 23 },
  { day: "Sun", dayBn: "রবি", condition: "Cloudy", conditionBn: "মেঘলা", high: 31, low: 25 },
];

// ── Districts ────────────────────────────────────────────────

export const mockDistricts: DistrictWeather[] = [
  {
    district: "Dhaka",
    districtBn: "ঢাকা",
    division: "Dhaka",
    divisionBn: "ঢাকা",
    temperature: 32,
    rainfall: 45,
    windSpeed: 28,
    riskLevel: "moderate",
  },
  {
    district: "Sylhet",
    districtBn: "সিলেট",
    division: "Sylhet",
    divisionBn: "সিলেট",
    temperature: 28,
    rainfall: 120,
    windSpeed: 35,
    riskLevel: "high",
  },
  {
    district: "Chittagong",
    districtBn: "চট্টগ্রাম",
    division: "Chittagong",
    divisionBn: "চট্টগ্রাম",
    temperature: 30,
    rainfall: 65,
    windSpeed: 42,
    riskLevel: "high",
  },
];

// ── Volunteers ───────────────────────────────────────────────

export const mockVolunteers: Volunteer[] = [
  {
    id: "V001",
    name: "Ahmed Ali",
    nameBn: "আহমেদ আলী",
    phone: "+880 1712-345678",
    assignedArea: "Sylhet Sadar",
    assignedAreaBn: "সিলেট সদর",
    status: "active",
    tasksCompleted: 12,
  },
  {
    id: "V002",
    name: "Fatima Rahman",
    nameBn: "ফাতিমা রহমান",
    phone: "+880 1823-456789",
    assignedArea: "Netrokona",
    assignedAreaBn: "নেত্রকোনা",
    status: "available",
    tasksCompleted: 8,
  },
  {
    id: "V003",
    name: "Karim Hossain",
    nameBn: "করিম হোসেন",
    phone: "+880 1934-567890",
    assignedArea: "Sunamganj",
    assignedAreaBn: "সুনামগঞ্জ",
    status: "active",
    tasksCompleted: 15,
  },
];

export const mockVolunteerTeams: VolunteerTeam[] = [
  {
    id: "T001",
    name: "Team Alpha",
    nameBn: "টিম আলফা",
    activeMembers: 12,
    villages: 8,
    coverage: 85,
    location: "Sylhet District",
    locationBn: "সিলেট জেলা",
  },
  {
    id: "T002",
    name: "Team Beta",
    nameBn: "টিম বিটা",
    activeMembers: 10,
    villages: 6,
    coverage: 72,
    location: "Sunamganj District",
    locationBn: "সুনামগঞ্জ জেলা",
  },
];

// ── Incidents ────────────────────────────────────────────────

export const mockIncidents: Incident[] = [
  {
    id: "INC001",
    type: "Flood Level",
    typeBn: "বন্যার স্তর",
    location: "Sylhet Sadar",
    locationBn: "সিলেট সদর",
    district: "Sylhet",
    districtBn: "সিলেট",
    timeReported: "15 mins ago",
    timeReportedBn: "১৫ মিনিট আগে",
    source: "Field Report",
    sourceBn: "মাঠ প্রতিবেদন",
    verified: true,
    status: "investigating",
    details: "Water level rising rapidly in low-lying areas",
    detailsBn: "নিচু এলাকায় পানির স্তর দ্রুত বৃদ্ধি পাচ্ছে",
    severity: "high",
  },
  {
    id: "INC002",
    type: "Infrastructure Damage",
    typeBn: "অবকাঠামো ক্ষতি",
    location: "Netrokona",
    locationBn: "নেত্রকোনা",
    district: "Netrokona",
    districtBn: "নেত্রকোনা",
    timeReported: "1 hour ago",
    timeReportedBn: "১ ঘণ্টা আগে",
    source: "Volunteer Report",
    sourceBn: "স্বেচ্ছাসেবক রিপোর্ট",
    verified: true,
    status: "active",
    details: "Bridge partially collapsed, road access limited",
    detailsBn: "সেতু আংশিকভাবে ভেঙে পড়েছে, রাস্তার প্রবেশাধিকার সীমিত",
    severity: "critical",
  },
];

// ── Infrastructure ───────────────────────────────────────────

export const mockInfrastructure: Infrastructure[] = [
  {
    id: "INF001",
    name: "Sylhet Medical College Hospital",
    nameBn: "সিলেট মেডিকেল কলেজ হাসপাতাল",
    type: "hospital",
    location: "Sylhet Sadar",
    locationBn: "সিলেট সদর",
    district: "Sylhet",
    districtBn: "সিলেট",
    riskLevel: "high",
    exposure: 78,
    operationalStatus: "operational",
    capacity: 500,
    populationAffected: 50000,
    hazardType: "Flood",
    hazardTypeBn: "বন্যা",
  },
  {
    id: "INF002",
    name: "Central Relief Shelter",
    nameBn: "কেন্দ্রীয় ত্রাণ আশ্রয়কেন্দ্র",
    type: "shelter",
    location: "Netrokona",
    locationBn: "নেত্রকোনা",
    district: "Netrokona",
    districtBn: "নেত্রকোনা",
    riskLevel: "moderate",
    exposure: 45,
    operationalStatus: "operational",
    capacity: 1000,
    populationAffected: 15000,
    hazardType: "Storm",
    hazardTypeBn: "ঝড়",
  },
];

// ── Vulnerable Communities ───────────────────────────────────

export const mockVulnerableCommunities: VulnerableCommunity[] = [
  {
    id: "VC001",
    name: "Char Janajat",
    nameBn: "চর জনজাত",
    district: "Sylhet",
    districtBn: "সিলেট",
    population: 5000,
    vulnerabilityScore: 92,
    riskLevel: "critical",
    elevation: 2,
    shelterDistance: 8,
    hazardHistory: 15,
    riskDrivers: ["Low elevation", "High population density", "Limited shelter access"],
    riskDriversBn: ["নিম্ন উচ্চতা", "উচ্চ জনসংখ্যার ঘনত্ব", "সীমিত আশ্রয় প্রবেশাধিকার"],
  },
  {
    id: "VC002",
    name: "Sunamganj Lowlands",
    nameBn: "সুনামগঞ্জ নিম্নভূমি",
    district: "Sunamganj",
    districtBn: "সুনামগঞ্জ",
    population: 3500,
    vulnerabilityScore: 85,
    riskLevel: "high",
    elevation: 3,
    shelterDistance: 5,
    hazardHistory: 12,
    riskDrivers: ["Flood-prone area", "Poor road access"],
    riskDriversBn: ["বন্যাপ্রবণ এলাকা", "দুর্বল রাস্তা প্রবেশাধিকার"],
  },
];

// ── Queries ──────────────────────────────────────────────────

export const mockQueries: Query[] = [
  {
    id: "Q001",
    senderName: "Local Authority - Sylhet",
    senderNameBn: "স্থানীয় কর্তৃপক্ষ - সিলেট",
    role: "Local Authority",
    roleBn: "স্থানীয় কর্তৃপক্ষ",
    message: "Request for additional relief supplies in Zone A",
    messageBn: "জোন এ-তে অতিরিক্ত ত্রাণ সরবরাহের অনুরোধ",
    timeSubmitted: "2 hours ago",
    timeSubmittedBn: "২ ঘণ্টা আগে",
    priority: "high",
    answered: false,
  },
  {
    id: "Q002",
    senderName: "Volunteer - Ahmed Ali",
    senderNameBn: "স্বেচ্ছাসেবক - আহমেদ আলী",
    role: "Volunteer",
    roleBn: "স্বেচ্ছাসেবক",
    message: "Need medical supplies for flood-affected families",
    messageBn: "বন্যা-আক্রান্ত পরিবারের জন্য চিকিৎসা সরবরাহ প্রয়োজন",
    timeSubmitted: "5 hours ago",
    timeSubmittedBn: "৫ ঘণ্টা আগে",
    priority: "normal",
    answered: true,
    response: "Medical team dispatched to your location",
    responseBn: "আপনার অবস্থানে চিকিৎসা দল পাঠানো হয়েছে",
  },
  {
    id: "Q003",
    senderName: "Community Member - Kamal Hossain",
    senderNameBn: "সম্প্রদায় সদস্য - কামাল হোসেন",
    role: "Community Member",
    roleBn: "সম্প্রদায় সদস্য",
    message: "When will evacuation support arrive?",
    messageBn: "সরিয়ে নেওয়ার সহায়তা কখন আসবে?",
    timeSubmitted: "1 hour ago",
    timeSubmittedBn: "১ ঘণ্টা আগে",
    priority: "high",
    answered: false,
  },
];

// ── Authorities ──────────────────────────────────────────────

export const mockAuthorities: Authority[] = [
  {
    id: "AUTH001",
    name: "Sylhet Emergency Response Unit",
    nameBn: "সিলেট জরুরি প্রতিক্রিয়া ইউনিট",
    type: "Emergency Response Unit",
    typeBn: "জরুরি প্রতিক্রিয়া ইউনিট",
    region: "Northern Region",
    regionBn: "উত্তর অঞ্চল",
    district: "Sylhet",
    districtBn: "সিলেট",
    address: "123 Main Road, Sylhet",
    addressBn: "১২৩ মেইন রোড, সিলেট",
    contactPerson: "Dr. Rahman",
    contactPersonBn: "ডা. রহমান",
    email: "sylhet.eru@example.com",
    phone: "+880 1712-111111",
    emergencyHotline: "999",
    availablePersonnel: 50,
    status: "active",
    registeredDate: "2024-01-10",
  },
  {
    id: "AUTH002",
    name: "Netrokona Disaster Management Office",
    nameBn: "নেত্রকোনা দুর্যোগ ব্যবস্থাপনা অফিস",
    type: "Disaster Management Office",
    typeBn: "দুর্যোগ ব্যবস্থাপনা অফিস",
    region: "Central Region",
    regionBn: "মধ্য অঞ্চল",
    district: "Netrokona",
    districtBn: "নেত্রকোনা",
    address: "456 District Road, Netrokona",
    addressBn: "৪৫৬ জেলা রোড, নেত্রকোনা",
    contactPerson: "Mr. Karim",
    contactPersonBn: "জনাব করিম",
    email: "netrokona.dmo@example.com",
    phone: "+880 1823-222222",
    emergencyHotline: "999",
    availablePersonnel: 35,
    status: "active",
    registeredDate: "2024-01-12",
  },
];

// ── Risk Areas ───────────────────────────────────────────────

export const mockRiskAreas: RiskArea[] = [
  {
    id: "RA001",
    name: "Char Janajat Flood Zone",
    nameBn: "চর জনজাত বন্যা অঞ্চল",
    district: "Sylhet",
    districtBn: "সিলেট",
    priority: "critical",
    vulnerabilityScore: 92,
    exposedPopulation: 5000,
    exposedAssets: 1200,
    keyDrivers: ["Low elevation", "High population density", "Limited shelter access"],
    keyDriversBn: ["নিম্ন উচ্চতা", "উচ্চ জনসংখ্যার ঘনত্ব", "সীমিত আশ্রয় প্রবেশাধিকার"],
    recommendedAction: "Immediate evacuation and relief distribution",
    recommendedActionBn: "অবিলম্বে সরিয়ে নেওয়া এবং ত্রাণ বিতরণ",
  },
  {
    id: "RA002",
    name: "Sunamganj Lowlands",
    nameBn: "সুনামগঞ্জ নিম্নভূমি",
    district: "Sunamganj",
    districtBn: "সুনামগঞ্জ",
    priority: "high",
    vulnerabilityScore: 85,
    exposedPopulation: 3500,
    exposedAssets: 800,
    keyDrivers: ["Flood-prone area", "Poor road access", "Limited medical facilities"],
    keyDriversBn: ["বন্যাপ্রবণ এলাকা", "দুর্বল রাস্তা প্রবেশাধিকার", "সীমিত চিকিৎসা সুবিধা"],
    recommendedAction: "Deploy medical team and establish temporary shelter",
    recommendedActionBn: "চিকিৎসা দল মোতায়েন এবং অস্থায়ী আশ্রয়কেন্দ্র স্থাপন",
  },
  {
    id: "RA003",
    name: "Netrokona River Belt",
    nameBn: "নেত্রকোনা নদী বেল্ট",
    district: "Netrokona",
    districtBn: "নেত্রকোনা",
    priority: "medium",
    vulnerabilityScore: 72,
    exposedPopulation: 2800,
    exposedAssets: 600,
    keyDrivers: ["River proximity", "Seasonal flooding", "Agricultural dependency"],
    keyDriversBn: ["নদীর নৈকট্য", "মৌসুমী বন্যা", "কৃষি নির্ভরতা"],
    recommendedAction: "Monitor water levels and prepare evacuation routes",
    recommendedActionBn: "পানির স্তর পর্যবেক্ষণ এবং সরিয়ে নেওয়ার রুট প্রস্তুত করুন",
  },
];

// ──────────────────────────────────────────────────────────────
// LocalAuthority-specific mock data (for LocalAuthority Dashboard,
// VolunteerManagement, TaskManagement, MemberList pages)
// ──────────────────────────────────────────────────────────────

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

// ── Union Tasks ───────────────────────────────────────────────

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

// ── Union Volunteers ──────────────────────────────────────────

export const volunteers: Volunteer[] = [
  { id: "UV001", name: "Aminul Islam", nameBn: "আমিনুল ইসলাম", phone: "+880 1712-111222", assignedArea: "Dakshin Para", assignedAreaBn: "দক্ষিণ পাড়া", tasksCompleted: 12, status: "active" },
  { id: "UV002", name: "Shahida Akter", nameBn: "শাহিদা আক্তার", phone: "+880 1823-222333", assignedArea: "Char Janajat", assignedAreaBn: "চর জনজাত", tasksCompleted: 8, status: "active" },
  { id: "UV003", name: "Rahim Uddin", nameBn: "রহিম উদ্দিন", phone: "+880 1934-333444", assignedArea: "Madhya Gram", assignedAreaBn: "মধ্য গ্রাম", tasksCompleted: 15, status: "active" },
  { id: "UV004", name: "Kulsum Begum", nameBn: "কুলসুম বেগম", phone: "+880 1745-444555", assignedArea: "Uttar Para", assignedAreaBn: "উত্তর পাড়া", tasksCompleted: 6, status: "active" },
  { id: "UV005", name: "Habibur Rahman", nameBn: "হাবিবুর রহমান", phone: "+880 1856-555666", assignedArea: "Paschim Bazar", assignedAreaBn: "পশ্চিম বাজার", tasksCompleted: 10, status: "available" },
  { id: "UV006", name: "Roksana Parvin", nameBn: "রোকসানা পারভিন", phone: "+880 1967-666777", assignedArea: "Not Assigned", assignedAreaBn: "নির্ধারিত নয়", tasksCompleted: 4, status: "available" },
  { id: "UV007", name: "Khalid Hasan", nameBn: "খালিদ হাসান", phone: "+880 1778-777888", assignedArea: "Purba Ghosh Para", assignedAreaBn: "পূর্ব ঘোষ পাড়া", tasksCompleted: 9, status: "off-duty" },
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

// ── Alert Timeline ────────────────────────────────────────────

export const alertTimelineData: AlertItem[] = [
  { headline: "Flood risk near Padma river area", headlineBn: "পদ্মা নদী এলাকায় বন্যার ঝুঁকি", description: "Water levels rising rapidly. Residents in low-lying areas should move to higher ground immediately.", descriptionBn: "পানির স্তর দ্রুত বাড়ছে। নিচু এলাকার বাসিন্দাদের অবিলম্বে উঁচু স্থানে যাওয়া উচিত।", timestamp: "10:15 AM", timestampBn: "১০:১৫ AM" },
  { headline: "Heavy rainfall expected tonight", headlineBn: "আজ রাতে ভারী বৃষ্টিপাতের সম্ভাবনা", description: "Meteorological department forecasts 150mm rainfall. Please stay indoors and avoid travel.", descriptionBn: "আবহাওয়া বিভাগ ১৫০ মিমি বৃষ্টিপাতের পূর্বাভাস দিয়েছে। অনুগ্রহ করে ঘরে থাকুন এবং ভ্রমণ এড়িয়ে চলুন।", timestamp: "6:30 PM", timestampBn: "৬:৩০ PM" },
  { headline: "Evacuation order for Char Janajat", headlineBn: "চর জনজাতের জন্য সরিয়ে নেওয়ার নির্দেশ", description: "Mandatory evacuation ordered due to flood risk. Proceed to the nearest shelter immediately.", descriptionBn: "বন্যার ঝুঁকির কারণে বাধ্যতামূলক সরিয়ে নেওয়ার নির্দেশ। অবিলম্বে নিকটতম আশ্রয়কেন্দ্রে যান।", timestamp: "Yesterday, 3:45 PM", timestampBn: "গতকাল, ৩:৪৫ PM" },
  { headline: "Emergency shelter opened at Union Parishad Complex", headlineBn: "ইউনিয়ন পরিষদ কমপ্লেক্সে জরুরি আশ্রয়কেন্দ্র খোলা হয়েছে", description: "Shelter facilities now available with food, water, and medical support.", descriptionBn: "খাবার, পানি এবং চিকিৎসা সহায়তাসহ আশ্রয়কেন্দ্র এখন উন্মুক্ত।", timestamp: "Yesterday, 2:20 PM", timestampBn: "গতকাল, ২:২০ PM" },
];

