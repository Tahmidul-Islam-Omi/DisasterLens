// ──────────────────────────────────────────────────────────────
// Shared TypeScript interfaces for the DisasterLens frontend.
// Import from "@/app/types" (or relative path) in any component.
// ──────────────────────────────────────────────────────────────

// ── Core enums / union types ─────────────────────────────────

export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "pending" | "assigned" | "in-progress" | "completed" | "overdue";
export type VolunteerStatus = "active" | "available" | "off-duty";
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

// ── Volunteer ────────────────────────────────────────────────

export interface Volunteer {
  name: string;
  nameBn: string;
  phone: string;
  assignedArea: string;
  assignedAreaBn: string;
  tasksCompleted: number;
  status: VolunteerStatus;
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

// ── Alert ────────────────────────────────────────────────────

export interface AlertItem {
  headline: string;
  headlineBn: string;
  description: string;
  descriptionBn: string;
  timestamp: string;
  timestampBn: string;
}
