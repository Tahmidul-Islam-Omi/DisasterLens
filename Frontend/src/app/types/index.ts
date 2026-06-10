// ──────────────────────────────────────────────────────────────
// Shared TypeScript interfaces for the ResilienceAI frontend.
// Import from "@/app/types" (or relative path) in any component.
// ──────────────────────────────────────────────────────────────

// ── Core enums / union types ─────────────────────────────────

export type AlertSeverity = "emergency" | "warning" | "information";
export type AlertStatus = "active" | "monitoring" | "resolved";
export type IncidentStatus = "investigating" | "active" | "resolved";
export type VolunteerStatus = "active" | "available" | "off-duty";
export type InfrastructureType = "hospital" | "shelter" | "power_facility" | "school" | "road";
export type RiskLevel = "critical" | "high" | "moderate" | "low";
export type Role = "Admin" | "LocalAuthority" | "Volunteer";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "pending" | "assigned" | "in-progress" | "completed" | "overdue";
export type CommunityResponseStatus = "safe" | "help" | "rescue" | "no-response";

// ── Village ──────────────────────────────────────────────────

export interface Village {
  id: string;
  nameKey: string;          // i18n translation key, e.g. "village.dakshinPara"
  members: number;
}

export interface VillageStatus {
  villageName: string;
  villageNameBn: string;
  safe: number;
  needHelp: number;
  needRescue: number;
  noResponse: number;
}

// ── Task ─────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  titleBn: string;
  type: string;
  typeBn: string;
  priority: TaskPriority;
  location: string;
  locationBn: string;
  assignedTo: string | string[];
  assignedToBn: string | string[];
  status: TaskStatus;
  progress: number;
  deadline: string;
  deadlineBn: string;
  description: string;
  startTime: string;
  equipmentNeeded: string[];
}

/** Lightweight task used in the Dashboard's "Recent Tasks" panel. */
export interface RecentTask {
  id: string;
  title: string;
  titleBn: string;
  priority: TaskPriority;
  assignedTo: string;
  assignedToBn: string;
  status: TaskStatus;
}

/** Simplified volunteer used in the AssignTask dialog checkbox list. */
export interface VolunteerOption {
  id: string;
  name: string;
  nameBn: string;
  status: VolunteerStatus;
}

// ── Community ────────────────────────────────────────────────

export interface CommunityResponse {
  name: string;
  nameBn: string;
  village: string;
  villageBn: string;
  phone: string;
  status: CommunityResponseStatus;
  lastResponse: string;
  lastResponseBn: string;
}

export interface SilentCommunity {
  villageName: string;
  villageNameBn: string;
  populationContacted: number;
  responsesReceived: number;
}

// ── Member ───────────────────────────────────────────────────

export interface Member {
  id: string;
  name: string;
  nameBn: string;
  age: number;
  gender: string;
  genderBn: string;
  village: string;
  villageBn: string;
  phone: string;
  household: string;
}

// ── Alert Timeline ────────────────────────────────────────────

export interface AlertItem {
  headline: string;
  headlineBn: string;
  description: string;
  descriptionBn: string;
  timestamp: string;
  timestampBn: string;
}

// ── Weather & Alerts ─────────────────────────────────────────

export interface WeatherAlert {
  id: string;
  headline: string;
  headlineBn: string;
  description: string;
  descriptionBn: string;
  severity: AlertSeverity;
  category: string;
  categoryBn: string;
  region: string;
  regionBn: string;
  timeIssued: string;
  timeIssuedBn: string;
  status: AlertStatus;
  publishedDate: string;
}

export interface WeatherForecast {
  day: string;
  dayBn: string;
  condition: string;
  conditionBn: string;
  high: number;
  low: number;
}

export interface DistrictWeather {
  district: string;
  districtBn: string;
  division: string;
  divisionBn: string;
  temperature: number;
  rainfall: number;
  windSpeed: number;
  riskLevel: RiskLevel;
}

// ── Missing Persons ──────────────────────────────────────────

export interface MissingPerson {
  id: number;
  name: string;
  nameBn: string;
  age: number;
  lastSeen: string;
  lastSeenBn: string;
  date: string;
  dateBn: string;
  status: string;
  statusBn: string;
  score: number;
  phone: string;
  img: string;
}

export interface MissingPersonReport {
  fullName: string;
  fullNameBn: string;
  age: number;
  gender: string;
  genderBn: string;
  lastSeenLocation: string;
  lastSeenLocationBn: string;
  dateLastSeen: string;
  timeLastSeen: string;
  photo?: string;
  clothingDescription: string;
  clothingDescriptionBn: string;
  contactInfo: string;
  additionalNotes: string;
  additionalNotesBn: string;
}

// ── Incidents & Logs ─────────────────────────────────────────

export interface Incident {
  id: string;
  type: string;
  typeBn: string;
  location: string;
  locationBn: string;
  district: string;
  districtBn: string;
  timeReported: string;
  timeReportedBn: string;
  source: string;
  sourceBn: string;
  verified: boolean;
  status: IncidentStatus;
  details: string;
  detailsBn: string;
  severity: RiskLevel;
}

export interface ActivityLog {
  id: string;
  village: string;
  villageBn: string;
  time: string;
  activityTypes: string[];
  activityTypesBn: string[];
  households: number;
  peopleRescued: number;
  reliefKits: number;
  notes: string;
  notesBn: string;
  urgency: "routine" | "urgent" | "critical";
  photo?: string;
}

export interface FieldReport {
  id: string;
  incidentType: string;
  incidentTypeBn: string;
  location: string;
  locationBn: string;
  incidentSummary: string;
  incidentSummaryBn: string;
  damagesObserved: string;
  damagesObservedBn: string;
  immediateNeeds: string;
  immediateNeedsBn: string;
  affectedPeople: number;
  photo?: string;
  voiceNote?: string;
  flaggedUrgent: boolean;
  timestamp: string;
}

// ── Volunteers ───────────────────────────────────────────────

export interface Volunteer {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  assignedArea: string;
  assignedAreaBn: string;
  status: VolunteerStatus;
  tasksCompleted: number;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  operationalRadius?: number;
}

export interface VolunteerTeam {
  id: string;
  name: string;
  nameBn: string;
  activeMembers: number;
  villages: number;
  coverage: number;
  location: string;
  locationBn: string;
}

// ── Infrastructure ───────────────────────────────────────────

export interface Infrastructure {
  id: string;
  name: string;
  nameBn: string;
  type: InfrastructureType;
  location: string;
  locationBn: string;
  district: string;
  districtBn: string;
  riskLevel: RiskLevel;
  exposure: number;
  operationalStatus: "operational" | "compromised" | "offline";
  capacity: number;
  populationAffected: number;
  hazardType: string;
  hazardTypeBn: string;
}

// ── Communities ──────────────────────────────────────────────

export interface VulnerableCommunity {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  districtBn: string;
  population: number;
  vulnerabilityScore: number;
  riskLevel: RiskLevel;
  elevation: number;
  shelterDistance: number;
  hazardHistory: number;
  riskDrivers: string[];
  riskDriversBn: string[];
}

export interface CommunityStatus {
  sector: string;
  sectorBn: string;
  floodLevel: number;
  dangerLevel: number;
  householdsAffected: number;
  shelterOccupancy: number;
  electricity: "offline" | "partial" | "online";
  communication: "spotty" | "good";
  cleanWater: "critical" | "adequate";
  roadAccess: "blocked" | "partial" | "clear";
  healthEmergency: boolean;
  lastUpdated: string;
}

// ── Queries ──────────────────────────────────────────────────

export interface Query {
  id: string;
  senderName: string;
  senderNameBn: string;
  role: string;
  roleBn: string;
  message: string;
  messageBn: string;
  timeSubmitted: string;
  timeSubmittedBn: string;
  priority: "high" | "normal" | "low";
  answered: boolean;
  response?: string;
  responseBn?: string;
}

// ── Risk Assessment ──────────────────────────────────────────

export interface RiskArea {
  id: string;
  name: string;
  nameBn: string;
  district: string;
  districtBn: string;
  priority: "critical" | "high" | "medium" | "low";
  vulnerabilityScore: number;
  exposedPopulation: number;
  exposedAssets: number;
  keyDrivers: string[];
  keyDriversBn: string[];
  recommendedAction: string;
  recommendedActionBn: string;
}

// ── Authority Registration ───────────────────────────────────

export interface Authority {
  id: string;
  name: string;
  nameBn: string;
  type: string;
  typeBn: string;
  region: string;
  regionBn: string;
  district: string;
  districtBn: string;
  address: string;
  addressBn: string;
  contactPerson: string;
  contactPersonBn: string;
  email: string;
  phone: string;
  emergencyHotline: string;
  availablePersonnel: number;
  status: "active" | "pending" | "inactive";
  registeredDate: string;
}

// ── Impact Summary ───────────────────────────────────────────

export interface ImpactSummary {
  fatalities: number;
  missing: number;
  rescued: number;
  damages: string;
  damagesBn: string;
  affectedAreas: number;
  dangerLevel: RiskLevel;
  lastUpdated: string;
}

export interface PriorityAction {
  id: string;
  action: string;
  actionBn: string;
  priority: "critical" | "high" | "medium";
}

export interface TimelineEvent {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  time: string;
  timeBn: string;
  type: "incident" | "action" | "update";
}

// ── Geospatial ───────────────────────────────────────────────

export interface MapLayer {
  id: string;
  name: string;
  nameBn: string;
  enabled: boolean;
  category: "hazards" | "infrastructure" | "other";
}

export interface Hotspot {
  id: string;
  name: string;
  nameBn: string;
  lat: number;
  lng: number;
  severity: RiskLevel;
  affectedPopulation: number;
  exposedInfrastructure: number;
}

// ── Authentication ───────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  assignedArea?: string;
  assignedAreaBn?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  nameBn: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: Role;
  assignedArea?: string;
  assignedAreaBn?: string;
}
