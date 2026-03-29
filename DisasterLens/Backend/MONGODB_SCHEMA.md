# DisasterLens MongoDB Schema Documentation

This document describes all MongoDB collections used in the DisasterLens application.

## Database Name
`disasterlens`

---

## Collections Overview

### 1. **users**
User authentication and profile information.

```javascript
{
  _id: String (UUID),
  name: String,
  nameBn: String,              // Bengali name
  email: String (unique, lowercase),
  phone: String,
  password_hash: String,
  role: String,                // "Admin" | "LocalAuthority" | "Volunteer"
  avatar: String | null,
  assignedArea: String,
  assignedAreaBn: String,
  is_active: Boolean,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Indexes:**
- `email` (unique)

---

### 2. **volunteers**
Volunteer information and status tracking.

```javascript
{
  _id: String (UUID),
  name: String,
  nameBn: String,
  phone: String,
  assignedArea: String,
  assignedAreaBn: String,
  status: String,              // "active" | "available" | "offline"
  tasksCompleted: Number,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 3. **tasks**
Task assignments for disaster response.

```javascript
{
  _id: String (UUID),
  title: String,
  titleBn: String,
  type: String,                // "Relief" | "Medical" | "Rescue" | "Assessment"
  typeBn: String,
  priority: String,            // "low" | "normal" | "high" | "critical"
  location: String,
  locationBn: String,
  assignedTo: Array<String>,   // Array of volunteer names
  assignedToBn: Array<String>,
  status: String,              // "pending" | "assigned" | "in_progress" | "completed"
  progress: Number,            // 0-100
  deadline: String,
  deadlineBn: String,
  description: String,
  startTime: String,
  equipmentNeeded: Array<String>,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 4. **members**
Community members database.

```javascript
{
  _id: String,
  name: String,
  nameBn: String,
  age: Number,
  gender: String,
  genderBn: String,
  village: String,
  villageBn: String,
  phone: String,
  household: String            // Household ID
}
```

---

### 5. **community_responses**
Community member status responses during disasters.

```javascript
{
  _id: String (UUID),
  name: String,
  nameBn: String,
  village: String,
  villageBn: String,
  phone: String,
  status: String,              // "safe" | "help" | "rescue" | "no_response"
  lastResponse: String,        // e.g., "10 mins ago"
  lastResponseBn: String
}
```

---

### 6. **weather_alerts**
Weather warnings and alerts.

```javascript
{
  _id: String,
  headline: String,
  headlineBn: String,
  description: String,
  descriptionBn: String,
  severity: String,            // "info" | "warning" | "emergency"
  category: String,
  categoryBn: String,
  region: String,
  regionBn: String,
  timeIssued: String,
  timeIssuedBn: String,
  status: String,              // "active" | "expired"
  publishedDate: String        // ISO date
}
```

---

### 7. **authority_alerts**
Alerts created by local authorities.

```javascript
{
  _id: String (UUID),
  headline: String,
  headlineBn: String,
  description: String,
  descriptionBn: String,
  severity: String,
  region: String,
  regionBn: String,
  created_at: DateTime
}
```

---

### 8. **incidents**
Incident reports and field observations.

```javascript
{
  _id: String,
  type: String,
  typeBn: String,
  location: String,
  locationBn: String,
  district: String,
  districtBn: String,
  timeReported: String,
  timeReportedBn: String,
  source: String,              // "Field Report" | "Volunteer Report" | "Sensor"
  sourceBn: String,
  verified: Boolean,
  status: String,              // "investigating" | "active" | "resolved"
  details: String,
  detailsBn: String,
  severity: String             // "low" | "medium" | "high" | "critical"
}
```

---

### 9. **queries**
Questions and support requests from users.

```javascript
{
  _id: String,
  senderName: String,
  senderNameBn: String,
  role: String,
  roleBn: String,
  message: String,
  messageBn: String,
  timeSubmitted: String,
  timeSubmittedBn: String,
  priority: String,            // "low" | "normal" | "high"
  answered: Boolean,
  response: String (optional),
  responseBn: String (optional)
}
```

---

### 10. **district_weather**
Weather data by district.

```javascript
{
  _id: String,
  district: String,
  districtBn: String,
  division: String,
  divisionBn: String,
  temperature: Number,         // Celsius
  rainfall: Number,            // mm
  windSpeed: Number,           // km/h
  riskLevel: String            // "low" | "moderate" | "high" | "critical"
}
```

---

### 11. **missing_persons**
Missing persons reports and tracking with geolocation.

```javascript
{
  _id: String,                 // "MPXXXXXXXX" format
  name: String,
  nameBn: String,
  age: Number,
  lastSeen: String,
  lastSeenBn: String,
  date: String,                // ISO datetime or formatted date
  dateBn: String,
  status: String,              // "Reported Missing" | "Possible Match" | "Found"
  statusBn: String,
  score: Number (optional),    // Match confidence score 0-100
  phone: String,
  img: String (optional),      // Image URL
  gender: String (optional),
  clothingDescription: String (optional),
  additionalNotes: String (optional),
  lat: Number,                 // Latitude
  lng: Number,                 // Longitude
  reportedBy: String,          // User ID
  reportedRole: String,        // User role
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 12. **villages**
Village registry.

```javascript
{
  _id: String,
  nameKey: String,             // i18n key
  members: Number              // Population count
}
```

---

### 13. **village_status**
Village-level disaster response status.

```javascript
{
  _id: String (UUID),
  villageName: String,
  villageNameBn: String,
  safe: Number,                // Count of safe members
  needHelp: Number,            // Count needing help
  needRescue: Number,          // Count needing rescue
  noResponse: Number           // Count with no response
}
```

---

### 14. **silent_communities**
Communities with low response rates.

```javascript
{
  _id: String (UUID),
  villageName: String,
  villageNameBn: String,
  populationContacted: Number,
  responsesReceived: Number
}
```

---

### 15. **alert_timeline**
Timeline of alerts and notifications.

```javascript
{
  _id: String (UUID),
  headline: String,
  headlineBn: String,
  description: String,
  descriptionBn: String,
  timestamp: String,
  timestampBn: String
}
```

---

### 16. **volunteer_coverage_updates**
Volunteer field coverage reports with GPS tracking.

```javascript
{
  _id: ObjectId,
  coverage_update_code: String,  // "VCU-YYYYMMDDHHMMSS-XXX"
  team_id: String | null,
  user_id: String | null,
  location_name: String,
  location: {
    type: "Point",
    coordinates: [Number, Number]  // [longitude, latitude]
  },
  radius_km: Number,
  radius_unit: String,             // "km"
  coverage_geometry: Object | null,
  used_gps: Boolean,
  status_note: String,
  source: String,
  submitted_at: DateTime,
  created_at: DateTime,
  meta: {
    team_code: String,
    team_name: String
  }
}
```

---

### 17. **infra_exposure_reports**
Infrastructure exposure and damage reports with geolocation.

```javascript
{
  _id: String,                 // "IER-YYYYMMDDHHMMSS-XXX"
  name: String,                // Infrastructure name
  type: String,                // Infrastructure type (e.g., "Bridge", "Road", "Other")
  location: String,            // Location description
  hazard: String,              // Hazard type (e.g., "Flood", "Cyclone")
  severity: String,            // "Low" | "Medium" | "High" | "Critical"
  status: String,              // "Operational" | "Compromised" | "Destroyed"
  population: String,          // Affected population estimate
  lat: Number,                 // Latitude
  lng: Number,                 // Longitude
  notes: String,
  reported_by: String,         // User ID
  reported_role: String,       // User role
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 18. **vulnerable_communities**
Vulnerable community tracking with risk assessment.

```javascript
{
  _id: String,                 // "VC-XXXXXXXXXX" format
  name: String,
  district: String,
  population: String,          // Population count as string
  priorityScore: Number,
  riskLevel: String,           // "Low" | "Medium" | "High" | "Critical"
  shelterAccess: String,       // "Good" | "Moderate" | "Poor"
  roadAccessibility: String,   // "Good" | "At Risk" | "Blocked"
  hazardExposure: Array<String>, // ["Flood", "Cyclone", "Landslide", etc.]
  lat: Number,                 // Latitude
  lng: Number,                 // Longitude
  notes: String,
  created_by: String,          // User ID
  created_role: String,        // User role
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## News & Intelligence Collections

### 19. **intel_articles**
Processed intelligence articles from news sources.

```javascript
{
  _id: ObjectId,
  fingerprint: String (SHA256), // Unique content hash
  source: String,
  url: String,
  title: String,
  clean_text: String,
  published_at: String,
  language: String,            // "bn" | "en"
  tags: Array<String>,         // ["flood", "cyclone", "rainfall", etc.]
  summary: {
    provider: String,          // "gemini" | "mistral" | "qwen"
    model: String,
    text: String,
    confidence: Number,
    generated_at: DateTime
  },
  created_at: DateTime,
  updated_at: DateTime
}
```

**Indexes:**
- `fingerprint` (unique)

---

### 20. **news_articles_raw**
Raw scraped news articles.

```javascript
{
  _id: ObjectId,
  source_name: String,
  source_url: String,
  canonical_url: String,
  title_raw: String,
  text_raw: String,
  published_at_raw: String,
  language_detected: String,
  scrape_status: String,       // "success" | "failed"
  scraped_at: DateTime,
  content_hash: String (SHA256),
  created_at: DateTime
}
```

**Indexes:**
- `content_hash` (unique)

---

### 21. **news_articles_processed**
Processed and analyzed news articles.

```javascript
{
  _id: ObjectId,
  raw_article_id: ObjectId,    // Reference to news_articles_raw
  source_name: String,
  source_url: String,
  title: String,
  article_text: String,
  published_at: String,
  language: String,
  hazard_tags: Array<String>,
  verified: Boolean,
  affected_district_codes: Array<String>,
  affected_upazila_codes: Array<String>,
  linked_event_id: String | null,
  llm_model: String,
  llm_summary_bn: String | null,
  llm_summary_en: String | null,
  llm_entities: Object,
  llm_confidence: Number,
  verification_status: String, // "unverified" | "verified" | "disputed"
  processed_at: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Indexes:**
- `raw_article_id` (unique)
- `source_name`
- `processed_at`

---

### 22. **impact_summary_snapshots**
AI-generated impact analysis snapshots.

```javascript
{
  _id: ObjectId,
  snapshot_code: String,       // "impact-YYYYMMDDHHMMSS"
  event_id: String | null,
  snapshot_at: DateTime,
  fatalities: Number,
  missing: Number,
  rescued: Number,
  damages_count: Number,
  estimated_loss_bdt: Number,
  affected_areas_count: Number,
  danger_level: String,        // "info" | "warning" | "high" | "critical"
  executive_summary_bn: String,
  executive_summary_en: String,
  priority_actions: Array<String>,
  priority_actions_bn: Array<String>,
  recovery_needs: Array<String>,
  recovery_needs_bn: Array<String>,
  source_refs: Array<{
    source: String,
    count: Number
  }>,
  updated_by_pipeline: String,
  created_at: DateTime
}
```

**Indexes:**
- `snapshot_at`

---

## Geographic Reference Collections

### 23. **geo_divisions**
Bangladesh administrative divisions.

```javascript
{
  _id: ObjectId,
  division_id: String,
  name: String,
  name_bn: String,
  name_lc: String              // Lowercase for search
}
```

**Indexes:**
- `division_id` (unique)
- `name_lc`

---

### 24. **geo_districts**
Bangladesh districts.

```javascript
{
  _id: ObjectId,
  district_id: String,
  division_id: String,
  name: String,
  name_bn: String,
  name_lc: String,
  lat: Number (optional),
  lon: Number (optional)
}
```

**Indexes:**
- `district_id` (unique)
- `division_id`
- `name_lc`

---

### 25. **geo_upazilas**
Bangladesh upazilas (sub-districts).

```javascript
{
  _id: ObjectId,
  upazila_id: String,
  district_id: String,
  name: String,
  name_bn: String,
  name_lc: String
}
```

**Indexes:**
- `upazila_id`
- `district_id`
- `name_lc`

---

### 26. **geo_unions**
Bangladesh unions (smallest administrative unit).

```javascript
{
  _id: ObjectId,
  union_id: String,
  upazila_id: String,
  name: String,
  name_bn: String,
  name_lc: String
}
```

**Indexes:**
- `union_id`
- `upazila_id`
- `name_lc`

---

### 27. **test_items**
Test collection for development and testing purposes.

```javascript
{
  _id: String (UUID),
  name: String,
  description: String,
  is_active: Boolean,
  created_at: DateTime
}
```

---

## Notes

### Data Types
- **String**: Text data
- **Number**: Integer or float
- **Boolean**: true/false
- **DateTime**: ISO 8601 datetime
- **ObjectId**: MongoDB ObjectId
- **UUID**: String representation of UUID v4
- **Array**: List of values
- **Object**: Nested document

### Bilingual Support
Most collections include both English and Bengali (Bangla) fields:
- English fields: Standard field names
- Bengali fields: Suffixed with `Bn` (e.g., `nameBn`, `titleBn`)

### Common Patterns
- `_id`: Primary key (String UUID or ObjectId)
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp
- `*_bn`: Bengali translation of the field
- `*_lc`: Lowercase version for case-insensitive search

### Status Values
Common status enumerations used across collections:
- **Task Status**: pending, assigned, in_progress, completed
- **Priority**: low, normal, high, critical
- **Risk Level**: low, moderate, high, critical
- **Severity**: info, warning, high, critical, emergency
- **Danger Level**: info, warning, high, critical
