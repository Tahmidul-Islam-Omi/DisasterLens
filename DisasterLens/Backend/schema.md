```
// users
// {
//   _id: ObjectId,
//   user_code: string,
//   full_name: string,
//   full_name_bn: string|null,
//   email: string|null,
//   phone: string|null,
//   password_hash: string,
//   role: string,                    // admin, authority, volunteer
//   role_bn: string|null,
//   status: string,                  // active, inactive, blocked
//   status_bn: string|null,
//   authority_id: ObjectId|null,
//   volunteer_id: ObjectId|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   last_login_at: date|null,
//   created_at: date,
//   updated_at: date
// }

// admin_units
// {
//   _id: ObjectId,
//   unit_code: string,
//   unit_type: string,               // division, district, upazila, union, village
//   unit_type_bn: string|null,
//   name_en: string,
//   name_bn: string|null,
//   parent_unit_code: string|null,
//   division_code: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   centroid: GeoJSON Point|null,
//   geometry: GeoJSON Polygon|MultiPolygon|null,
//   source: string|null,
//   source_bn: string|null,
//   created_at: date,
//   updated_at: date
// }

// villages
// {
//   _id: ObjectId,
//   village_code: string,
//   admin_unit_code: string|null,
//   name: string,
//   name_bn: string|null,
//   slug: string,
//   division_code: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   member_count: int,
//   location: GeoJSON Point,
//   geometry: GeoJSON Polygon|MultiPolygon|null,
//   created_at: date,
//   updated_at: date
// }

// community_members
// {
//   _id: ObjectId,
//   member_code: string,
//   name: string,
//   name_bn: string|null,
//   age: int|null,
//   gender: string|null,             // male, female, other
//   gender_bn: string|null,
//   phone: string|null,
//   village_id: ObjectId,
//   household_id: string|null,
//   status: string,                  // safe, help, rescue, no_response
//   status_bn: string|null,
//   last_response_at: date|null,
//   registered_at: date,
//   updated_at: date
// }

// authorities
// {
//   _id: ObjectId,
//   authority_code: string,
//   authority_name: string,
//   authority_name_bn: string|null,
//   authority_type: string,
//   authority_type_bn: string|null,
//   jurisdiction_area: string|null,
//   jurisdiction_area_bn: string|null,
//   division_code: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   location: {
//     region: string|null,
//     region_bn: string|null,
//     district: string|null,
//     district_bn: string|null,
//     physical_address: string|null,
//     physical_address_bn: string|null,
//     geo_point: GeoJSON Point|null
//   },
//   contact: {
//     person_name: string|null,
//     person_name_bn: string|null,
//     email: string|null,
//     phone_number: string|null,
//     emergency_hotline: string|null
//   },
//   available_personnel: int|null,
//   status: string,
//   status_bn: string|null,
//   verified_at: date|null,
//   verified_by: ObjectId|null,
//   notes: string|null,
//   notes_bn: string|null,
//   created_at: date,
//   updated_at: date
// }

// volunteer_teams
// {
//   _id: ObjectId,
//   team_code: string,
//   name: string,
//   name_bn: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   status: string,                  // active, inactive, standby
//   status_bn: string|null,
//   lead_user_id: ObjectId|null,
//   volunteer_ids: [ObjectId],
//   created_at: date,
//   updated_at: date
// }

// volunteers
// {
//   _id: ObjectId,
//   volunteer_code: string,
//   user_id: ObjectId|null,
//   team_id: ObjectId|null,
//   name: string,
//   name_bn: string|null,
//   phone: string|null,
//   assigned_village_ids: [ObjectId],
//   assigned_union_code: string|null,
//   district_code: string|null,
//   status: string,                  // active, available, off_duty
//   status_bn: string|null,
//   skills: [string],
//   skills_bn: [string]|null,
//   tasks_completed: int,
//   joined_at: date|null,
//   created_at: date,
//   updated_at: date
// }

// flood_stations
// {
//   _id: ObjectId,
//   station_code: string,
//   station_name: string,
//   station_name_bn: string|null,
//   river_name: string|null,
//   river_name_bn: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   location: GeoJSON Point,
//   source_name: string,
//   source_name_bn: string|null,
//   station_metadata: object|null,
//   created_at: date,
//   updated_at: date
// }

// flood_observations
// {
//   _id: ObjectId,
//   station_id: ObjectId,
//   observed_at: date,
//   water_level_m: double|null,
//   water_level_unit: string|null,
//   water_level_unit_bn: string|null,
//   danger_level_m: double|null,
//   danger_level_unit: string|null,
//   danger_level_unit_bn: string|null,
//   above_danger_level_m: double|null,
//   above_danger_level_unit: string|null,
//   above_danger_level_unit_bn: string|null,
//   rainfall_mm: double|null,
//   rainfall_unit: string|null,
//   rainfall_unit_bn: string|null,
//   trend: string|null,              // rising, falling, steady
//   trend_bn: string|null,
//   warning_status: string|null,
//   warning_status_bn: string|null,
//   raw_payload: object|null,
//   source_name: string,
//   source_name_bn: string|null,
//   created_at: date
// }

// weather_observations
// {
//   _id: ObjectId,
//   observation_code: string,
//   source_name: string,
//   source_name_bn: string|null,
//   admin_unit_code: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   location: GeoJSON Point|null,
//   observed_at: date,
//   temperature_c: double|null,
//   temperature_unit: string|null,
//   temperature_unit_bn: string|null,
//   rainfall_mm: double|null,
//   rainfall_unit: string|null,
//   rainfall_unit_bn: string|null,
//   wind_speed_kmh: double|null,
//   wind_speed_unit: string|null,
//   wind_speed_unit_bn: string|null,
//   wind_direction: string|null,
//   wind_direction_bn: string|null,
//   humidity_pct: double|null,
//   humidity_unit: string|null,
//   humidity_unit_bn: string|null,
//   pressure_hpa: double|null,
//   pressure_unit: string|null,
//   pressure_unit_bn: string|null,
//   visibility_km: double|null,
//   visibility_unit: string|null,
//   visibility_unit_bn: string|null,
//   storm_risk_level: string|null,
//   storm_risk_level_bn: string|null,
//   raw_payload: object|null,
//   created_at: date
// }

// hazard_alerts
// {
//   _id: ObjectId,
//   alert_code: string,
//   alert_type: string,              // cyclone_warning, flood_warning, rainfall_alert
//   alert_type_bn: string|null,
//   title: string,
//   title_bn: string|null,
//   description: string,
//   description_bn: string|null,
//   severity: string,                // info, warning, high, critical
//   severity_bn: string|null,
//   severity_score: double|null,
//   status: string,                  // draft, active, expired, resolved
//   status_bn: string|null,
//   source_type: string,             // official, manual, system
//   source_type_bn: string|null,
//   source_name: string,
//   source_name_bn: string|null,
//   affected_region_name: string|null,
//   affected_region_name_bn: string|null,
//   affected_division_codes: [string],
//   affected_district_codes: [string],
//   affected_upazila_codes: [string],
//   location: GeoJSON Point|null,
//   impact_geometry: GeoJSON Polygon|MultiPolygon|null,
//   issued_at: date,
//   expires_at: date|null,
//   resolved_at: date|null,
//   tags: [string],
//   tags_bn: [string]|null,
//   created_at: date,
//   updated_at: date
// }

// alert_campaigns
// {
//   _id: ObjectId,
//   campaign_code: string,
//   linked_alert_id: ObjectId|null,
//   original_message: string,
//   original_message_bn: string|null,
//   simplified_message_en: string|null,
//   simplified_message_bn: string|null,
//   severity: string,
//   severity_bn: string|null,
//   target_village_ids: [ObjectId],
//   recipient_count: int,
//   recipient_count_unit: string|null,
//   recipient_count_unit_bn: string|null,
//   status: string,                  // draft, queued, sent, failed
//   status_bn: string|null,
//   delivery_stats: {
//     total: int,
//     delivered: int,
//     failed: int,
//     total_unit: string|null,
//     total_unit_bn: string|null
//   },
//   sent_by: ObjectId|null,
//   sent_at: date|null,
//   created_at: date,
//   updated_at: date
// }

// query_messages
// {
//   _id: ObjectId,
//   query_code: string,
//   sender_name: string,
//   sender_name_bn: string|null,
//   sender_type: string,             // authority, volunteer, community_member, citizen
//   sender_type_bn: string|null,
//   sender_phone: string|null,
//   sender_user_id: ObjectId|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   subject: string|null,
//   subject_bn: string|null,
//   message: string,
//   message_bn: string|null,
//   priority_level: string|null,     // low, medium, high, urgent
//   priority_level_bn: string|null,
//   status: string,                  // pending, replied, closed
//   status_bn: string|null,
//   reply_message: string|null,
//   reply_message_bn: string|null,
//   replied_by: ObjectId|null,
//   replied_at: date|null,
//   created_at: date,
//   updated_at: date
// }

// disaster_events
// {
//   _id: ObjectId,
//   event_code: string,
//   name: string,
//   name_bn: string|null,
//   event_type: string,              // flood, cyclone, landslide, multi_hazard
//   event_type_bn: string|null,
//   status: string,                  // active, monitoring, resolved, archived
//   status_bn: string|null,
//   severity: string,
//   severity_bn: string|null,
//   region_name: string|null,
//   region_name_bn: string|null,
//   division_codes: [string],
//   district_codes: [string],
//   upazila_codes: [string],
//   primary_location: GeoJSON Point|null,
//   impact_geometry: GeoJSON Polygon|MultiPolygon|null,
//   started_at: date,
//   ended_at: date|null,
//   created_by: ObjectId|null,
//   created_at: date,
//   updated_at: date
// }

// disaster_event_snapshots
// {
//   _id: ObjectId,
//   event_id: ObjectId,
//   snapshot_at: date,
//   affected_population: int,
//   affected_population_unit: string|null,
//   affected_population_unit_bn: string|null,
//   fatalities: int,
//   fatalities_unit: string|null,
//   fatalities_unit_bn: string|null,
//   missing: int,
//   missing_unit: string|null,
//   missing_unit_bn: string|null,
//   rescued: int,
//   rescued_unit: string|null,
//   rescued_unit_bn: string|null,
//   estimated_damage_bdt: double,
//   estimated_damage_unit: string|null,
//   estimated_damage_unit_bn: string|null,
//   exposed_infrastructure_count: int,
//   exposed_infrastructure_count_unit: string|null,
//   exposed_infrastructure_count_unit_bn: string|null,
//   danger_level_label: string,
//   danger_level_label_bn: string|null,
//   ai_situation_intelligence_bn: string|null,
//   ai_situation_intelligence_en: string|null,
//   summary_source_refs: [
//     {
//       source_type: string,
//       source_type_bn: string|null,
//       source_id: ObjectId|string
//     }
//   ],
//   updated_by_pipeline: string|null,
//   updated_by_pipeline_bn: string|null,
//   created_at: date
// }

// event_hotspots
// {
//   _id: ObjectId,
//   hotspot_code: string,
//   event_id: ObjectId,
//   name: string,
//   name_bn: string|null,
//   priority_rank: int,
//   severity: string,
//   severity_bn: string|null,
//   summary: string,
//   summary_bn: string|null,
//   affected_population: int,
//   affected_population_unit: string|null,
//   affected_population_unit_bn: string|null,
//   location: GeoJSON Point|null,
//   geometry: GeoJSON Polygon|MultiPolygon|null,
//   affected_assets: [
//     {
//       asset_type: string,
//       asset_type_bn: string|null,
//       name: string,
//       name_bn: string|null,
//       status: string,
//       status_bn: string|null
//     }
//   ],
//   recommended_action: string|null,
//   recommended_action_bn: string|null,
//   status: string,                  // open, closed, monitoring
//   status_bn: string|null,
//   created_at: date,
//   updated_at: date
// }

// incident_timeline_events
// {
//   _id: ObjectId,
//   timeline_code: string,
//   event_id: ObjectId|null,
//   event_type: string,              // bridge_collapse, rescue_units_deployed, etc
//   event_type_bn: string|null,
//   title: string,
//   title_bn: string|null,
//   description: string,
//   description_bn: string|null,
//   severity: string,                // info, moderate, high, critical
//   severity_bn: string|null,
//   occurred_at: date,
//   district_code: string|null,
//   upazila_code: string|null,
//   location: GeoJSON Point|null,
//   source_type: string,             // news, field_report, official, manual
//   source_type_bn: string|null,
//   source_ref: ObjectId|string|null,
//   is_visible: bool,
//   created_at: date
// }

// impact_summary_snapshots
// {
//   _id: ObjectId,
//   snapshot_code: string,
//   event_id: ObjectId|null,
//   snapshot_at: date,
//   fatalities: int,
//   fatalities_unit: string|null,
//   fatalities_unit_bn: string|null,
//   missing: int,
//   missing_unit: string|null,
//   missing_unit_bn: string|null,
//   rescued: int,
//   rescued_unit: string|null,
//   rescued_unit_bn: string|null,
//   damages_count: int,
//   damages_count_unit: string|null,
//   damages_count_unit_bn: string|null,
//   estimated_loss_bdt: double,
//   estimated_loss_unit: string|null,
//   estimated_loss_unit_bn: string|null,
//   affected_areas_count: int,
//   affected_areas_count_unit: string|null,
//   affected_areas_count_unit_bn: string|null,
//   danger_level: string,
//   danger_level_bn: string|null,
//   executive_summary_bn: string|null,
//   executive_summary_en: string|null,
//   priority_actions: [string],
//   priority_actions_bn: [string]|null,
//   recovery_needs: [string],
//   recovery_needs_bn: [string]|null,
//   source_refs: [object],
//   created_at: date
// }

// source_registry
// {
//   _id: ObjectId,
//   source_code: string,
//   source_name: string,
//   source_name_bn: string|null,
//   source_type: string,             // news_portal, official_site, rss, api
//   source_type_bn: string|null,
//   base_url: string,
//   rss_url: string|null,
//   is_active: bool,
//   crawl_interval_min: int|null,
//   language: string|null,
//   created_at: date,
//   updated_at: date
// }

// ingestion_jobs
// {
//   _id: ObjectId,
//   job_code: string,
//   job_type: string,                // news_scrape, official_fetch, llm_process
//   job_type_bn: string|null,
//   source_code: string|null,
//   status: string,                  // queued, running, success, failed
//   status_bn: string|null,
//   started_at: date|null,
//   finished_at: date|null,
//   items_fetched: int|null,
//   items_processed: int|null,
//   error_message: string|null,
//   error_message_bn: string|null,
//   created_at: date,
//   updated_at: date
// }

// news_articles_raw
// {
//   _id: ObjectId,
//   source_name: string,
//   source_name_bn: string|null,
//   source_url: string,
//   canonical_url: string|null,
//   title_raw: string,
//   title_raw_bn: string|null,
//   html_raw: string|null,
//   text_raw: string|null,
//   text_raw_bn: string|null,
//   published_at_raw: string|null,
//   author_raw: string|null,
//   author_raw_bn: string|null,
//   language_detected: string|null,
//   scrape_status: string,
//   scrape_status_bn: string|null,
//   scraped_at: date,
//   content_hash: string,
//   job_id: ObjectId|null,
//   created_at: date
// }

// news_articles_processed
// {
//   _id: ObjectId,
//   raw_article_id: ObjectId,
//   source_name: string,
//   source_name_bn: string|null,
//   title: string,
//   title_bn: string|null,
//   excerpt: string|null,
//   excerpt_bn: string|null,
//   article_text: string,
//   article_text_bn: string|null,
//   published_at: date|null,
//   language: string|null,
//   hazard_tags: [string],
//   hazard_tags_bn: [string]|null,
//   location_mentions: [
//     {
//       name: string,
//       name_bn: string|null,
//       district_code: string|null,
//       upazila_code: string|null,
//       location: GeoJSON Point|null,
//       confidence: double|null
//     }
//   ],
//   verified: bool,
//   primary_disaster_location: GeoJSON Point|null,
//   affected_district_codes: [string],
//   affected_upazila_codes: [string],
//   linked_event_id: ObjectId|null,
//   llm_model: string|null,
//   llm_summary_bn: string|null,
//   llm_summary_en: string|null,
//   llm_entities: object|null,
//   llm_confidence: double|null,
//   verification_status: string,     // unverified, verified, rejected
//   verification_status_bn: string|null,
//   processed_at: date,
//   created_at: date,
//   updated_at: date
// }

// geospatial_dashboard_snapshots
// {
//   _id: ObjectId,
//   snapshot_code: string,
//   generated_at: date,
//   exposed_infra_count: int,
//   exposed_infra_count_unit: string|null,
//   exposed_infra_count_unit_bn: string|null,
//   high_risk_areas_count: int,
//   high_risk_areas_count_unit: string|null,
//   high_risk_areas_count_unit_bn: string|null,
//   affected_population_count: double,
//   affected_population_unit: string|null,
//   affected_population_unit_bn: string|null,
//   danger_level: string,
//   danger_level_bn: string|null
// }

// geospatial_layers
// {
//   _id: ObjectId,
//   layer_code: string,
//   layer_type: string,              // hazard, infrastructure, communities, route, relief, etc
//   layer_type_bn: string|null,
//   layer_name: string,
//   layer_name_bn: string|null,
//   layer_key: string,
//   geometry_type: string,
//   geometry_type_bn: string|null,
//   geometry: GeoJSON,
//   severity: string|null,
//   severity_bn: string|null,
//   district_codes: [string],
//   upazila_codes: [string],
//   style: {
//     fill_color: string|null,
//     stroke_color: string|null,
//     opacity: double|null
//   },
//   is_active: bool,
//   created_at: date,
//   updated_at: date
// }

// hazard_zones
// {
//   _id: ObjectId,
//   zone_code: string,
//   zone_name: string,
//   zone_name_bn: string|null,
//   region_name: string|null,
//   region_name_bn: string|null,
//   description: string|null,
//   description_bn: string|null,
//   risk_level: string,
//   risk_level_bn: string|null,
//   risk_score: double,
//   active_hazards: [
//     {
//       hazard_type: string,
//       hazard_type_bn: string|null,
//       severity: string,
//       severity_bn: string|null,
//       detected_at: date,
//       notes: string|null,
//       notes_bn: string|null
//     }
//   ],
//   current_conditions: {
//     temperature_celsius: double|null,
//     temperature_unit: string|null,
//     temperature_unit_bn: string|null,
//     humidity: double|null,
//     humidity_unit: string|null,
//     humidity_unit_bn: string|null,
//     wind_speed_kmh: double|null,
//     wind_speed_unit: string|null,
//     wind_speed_unit_bn: string|null,
//     wind_direction: string|null,
//     wind_direction_bn: string|null,
//     rainfall_mm: double|null,
//     rainfall_unit: string|null,
//     rainfall_unit_bn: string|null,
//     visibility: string|null,
//     visibility_bn: string|null,
//     recorded_at: date|null
//   },
//   district_codes: [string],
//   upazila_codes: [string],
//   location: GeoJSON Point|null,
//   geometry: GeoJSON Polygon|MultiPolygon|null,
//   is_active: bool,
//   created_at: date,
//   updated_at: date
// }

// priority_areas
// {
//   _id: ObjectId,
//   priority_code: string,
//   area_name: string,
//   area_name_bn: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   hazard_type: string,
//   hazard_type_bn: string|null,
//   severity: string,
//   severity_bn: string|null,
//   exposed_population: int,
//   exposed_population_unit: string|null,
//   exposed_population_unit_bn: string|null,
//   risk_score: double,
//   summary: string,
//   summary_bn: string|null,
//   location: GeoJSON Point|null,
//   geometry: GeoJSON Polygon|MultiPolygon|null,
//   source_snapshot_id: ObjectId|null,
//   created_at: date,
//   updated_at: date
// }

// infrastructure_assets
// {
//   _id: ObjectId,
//   asset_code: string,
//   name: string,
//   name_bn: string|null,
//   asset_type: string,              // hospital, bridge, school, shelter, road, power, water_point
//   asset_type_bn: string|null,
//   description: string|null,
//   description_bn: string|null,
//   division_code: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   village_id: ObjectId|null,
//   address: string|null,
//   address_bn: string|null,
//   location: GeoJSON Point|null,
//   geometry: GeoJSON Polygon|MultiPolygon|LineString|MultiLineString|null,
//   operational_status: string,      // operational, compromised, offline, inaccessible
//   operational_status_bn: string|null,
//   risk_level: string|null,
//   risk_level_bn: string|null,
//   risk_score: double|null,
//   capacity: int|null,
//   capacity_unit: string|null,
//   capacity_unit_bn: string|null,
//   current_occupancy: int|null,
//   occupancy_unit: string|null,
//   occupancy_unit_bn: string|null,
//   contact: {
//     name: string|null,
//     name_bn: string|null,
//     phone: string|null,
//     email: string|null
//   },
//   tags: [string],
//   tags_bn: [string]|null,
//   exposures: [
//     {
//       hazard_type: string,
//       hazard_type_bn: string|null,
//       severity: string,
//       severity_bn: string|null,
//       detected_at: date,
//       resolved_at: date|null,
//       is_active: bool,
//       notes: string|null,
//       notes_bn: string|null
//     }
//   ],
//   created_at: date,
//   updated_at: date
// }

// tasks
// {
//   _id: ObjectId,
//   task_code: string,
//   title: string,
//   title_bn: string|null,
//   description: string|null,
//   description_bn: string|null,
//   type: string,                    // relief_distribution, field_assessment, medical_aid, evacuation_support
//   type_bn: string|null,
//   priority: string,                // critical, high, medium, low
//   priority_bn: string|null,
//   status: string,                  // pending, assigned, in_progress, completed, overdue
//   status_bn: string|null,
//   progress: int,
//   event_id: ObjectId|null,
//   village_id: ObjectId|null,
//   district_code: string|null,
//   location_name: string|null,
//   location_name_bn: string|null,
//   location: GeoJSON Point|null,
//   assigned_to: [ObjectId],
//   assigned_team_id: ObjectId|null,
//   equipment_needed: [string],
//   equipment_needed_bn: [string]|null,
//   start_time: date|null,
//   deadline: date|null,
//   completed_at: date|null,
//   created_by: ObjectId|null,
//   created_at: date,
//   updated_at: date
// }

// volunteer_live_locations
// {
//   ping_at: date,
//   meta: {
//     team_id: ObjectId,
//     team_code: string,
//     district_code: string|null,
//     volunteer_id: ObjectId|null
//   },
//   location: GeoJSON Point,
//   speed_kmh: double|null,
//   speed_unit: string|null,
//   speed_unit_bn: string|null,
//   status: string|null,             // moving, resting, active
//   status_bn: string|null
// }

// volunteer_coverage_updates
// {
//   _id: ObjectId,
//   coverage_update_code: string,
//   team_id: ObjectId,
//   user_id: ObjectId|null,
//   location_name: string|null,
//   location_name_bn: string|null,
//   location: GeoJSON Point,
//   radius_km: double,
//   radius_unit: string|null,
//   radius_unit_bn: string|null,
//   coverage_geometry: GeoJSON Polygon|null,
//   used_gps: bool,
//   status_note: string|null,
//   status_note_bn: string|null,
//   source: string,                  // mobile, web, manual
//   source_bn: string|null,
//   submitted_at: date,
//   created_at: date
// }

// volunteer_activity_updates
// {
//   _id: ObjectId,
//   activity_update_code: string,
//   team_id: ObjectId,
//   user_id: ObjectId|null,
//   update_type: string,             // coverage_update, relief_delivery, route_blocked, evacuation_complete
//   update_type_bn: string|null,
//   message: string,
//   message_bn: string|null,
//   location_name: string|null,
//   location_name_bn: string|null,
//   location: GeoJSON Point|null,
//   related_coverage_update_id: ObjectId|null,
//   created_at: date
// }


// volunteer_coverage_snapshots
// {
//   _id: ObjectId,
//   snapshot_code: string,
//   snapshot_at: date,
//   active_teams: int,
//   active_teams_unit: string|null,
//   active_teams_unit_bn: string|null,
//   villages_count: int,
//   villages_count_unit: string|null,
//   villages_count_unit_bn: string|null,
//   coverage_pct: double,
//   coverage_pct_unit: string|null,
//   coverage_pct_unit_bn: string|null,
//   relief_kits_delivered: int,
//   relief_kits_delivered_unit: string|null,
//   relief_kits_delivered_unit_bn: string|null,
//   created_at: date
// }

// field_reports
// {
//   _id: ObjectId,
//   report_code: string,
//   event_id: ObjectId|null,
//   submitted_by_user_id: ObjectId|null,
//   submitted_by_volunteer_id: ObjectId|null,
//   incident_type: string,
//   incident_type_bn: string|null,
//   summary: string,
//   summary_bn: string|null,
//   damages_observed: string|null,
//   damages_observed_bn: string|null,
//   immediate_needs: [string],
//   immediate_needs_bn: [string]|null,
//   affected_people_estimate: int|null,
//   affected_people_estimate_unit: string|null,
//   affected_people_estimate_unit_bn: string|null,
//   urgency_level: string,           // low, medium, high, critical
//   urgency_level_bn: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   village_id: ObjectId|null,
//   location: GeoJSON Point|null,
//   images: [string],
//   voice_note_url: string|null,
//   status: string,                  // submitted, verified, rejected, converted_to_incident
//   status_bn: string|null,
//   related_incident_id: ObjectId|null,
//   created_at: date,
//   updated_at: date
// }

// community_status_updates
// {
//   _id: ObjectId,
//   status_update_code: string,
//   event_id: ObjectId|null,
//   village_id: ObjectId|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   updated_by_user_id: ObjectId|null,
//   updated_by_volunteer_id: ObjectId|null,
//   flood_level_label: string|null,
//   flood_level_label_bn: string|null,
//   danger_level: string|null,
//   danger_level_bn: string|null,
//   households_affected: int|null,
//   households_affected_unit: string|null,
//   households_affected_unit_bn: string|null,
//   shelter_occupancy: int|null,
//   shelter_occupancy_unit: string|null,
//   shelter_occupancy_unit_bn: string|null,
//   electricity_status: string|null,
//   electricity_status_bn: string|null,
//   communication_status: string|null,
//   communication_status_bn: string|null,
//   clean_water_status: string|null,
//   clean_water_status_bn: string|null,
//   road_access_status: string|null,
//   road_access_status_bn: string|null,
//   health_emergency: bool|null,
//   notes: string|null,
//   notes_bn: string|null,
//   location: GeoJSON Point|null,
//   reported_at: date,
//   created_at: date
// }

// relief_points
// {
//   _id: ObjectId,
//   relief_point_code: string,
//   name: string,
//   name_bn: string|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   location: GeoJSON Point,
//   point_type: string,              // supply_hub, camp, warehouse, dropoff_point
//   point_type_bn: string|null,
//   status: string,                  // active, inactive, depleted
//   status_bn: string|null,
//   inventory_summary: object|null,
//   created_at: date,
//   updated_at: date
// }

// relief_distributions
// {
//   _id: ObjectId,
//   distribution_code: string,
//   event_id: ObjectId|null,
//   relief_point_id: ObjectId,
//   village_id: ObjectId|null,
//   team_id: ObjectId|null,
//   distributed_by_user_id: ObjectId|null,
//   delivered_items: [
//     {
//       item_name: string,
//       item_name_bn: string|null,
//       quantity: double,
//       unit: string,
//       unit_bn: string|null
//     }
//   ],
//   households_served: int|null,
//   households_served_unit: string|null,
//   households_served_unit_bn: string|null,
//   people_served: int|null,
//   people_served_unit: string|null,
//   people_served_unit_bn: string|null,
//   notes: string|null,
//   notes_bn: string|null,
//   location: GeoJSON Point|null,
//   delivered_at: date,
//   created_at: date
// }

// missing_person_cases
// {
//   _id: ObjectId,
//   case_code: string,
//   full_name: string,
//   full_name_bn: string|null,
//   age: int|null,
//   gender: string|null,
//   gender_bn: string|null,
//   last_seen_location_text: string|null,
//   last_seen_location_text_bn: string|null,
//   last_seen_location: GeoJSON Point|null,
//   district_code: string|null,
//   upazila_code: string|null,
//   union_code: string|null,
//   last_seen_at: date|null,
//   clothing_description: string|null,
//   clothing_description_bn: string|null,
//   distinguishing_marks: string|null,
//   distinguishing_marks_bn: string|null,
//   medical_notes: string|null,
//   medical_notes_bn: string|null,
//   contact_name: string|null,
//   contact_name_bn: string|null,
//   contact_phone: string|null,
//   contact_email: string|null,
//   current_status: string,          // missing, possible_match_found, found, closed
//   current_status_bn: string|null,
//   reported_by_user_id: ObjectId|null,
//   linked_event_id: ObjectId|null,
//   created_at: date,
//   updated_at: date
// }

// missing_person_images
// {
//   _id: ObjectId,
//   image_code: string,
//   case_id: ObjectId,
//   image_url: string|null,
//   storage_key: string|null,
//   image_type: string,              // profile, evidence, search_query
//   image_type_bn: string|null,
//   uploaded_by_user_id: ObjectId|null,
//   face_embedding_status: string,   // pending, processed, failed
//   face_embedding_status_bn: string|null,
//   face_embedding_vector_id: string|null,
//   created_at: date
// }

// missing_person_matches
// {
//   _id: ObjectId,
//   match_code: string,
//   query_image_id: ObjectId,
//   candidate_case_id: ObjectId,
//   similarity_score: double,
//   status: string,                  // generated, under_review, accepted, rejected
//   status_bn: string|null,
//   reviewed_by_user_id: ObjectId|null,
//   reviewed_at: date|null,
//   notes: string|null,
//   notes_bn: string|null,
//   created_at: date
// }

// audit_logs
// {
//   _id: ObjectId,
//   actor_user_id: ObjectId|null,
//   action_type: string,
//   action_type_bn: string|null,
//   entity_name: string,
//   entity_name_bn: string|null,
//   entity_id: ObjectId|string|null,
//   description: string|null,
//   description_bn: string|null,
//   meta: object|null,
//   created_at: date
// }

```