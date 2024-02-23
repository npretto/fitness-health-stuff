export type Activity = {
  resource_state: number;
  athlete: Athlete;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: Type;
  sport_type: Type;
  id: number;
  start_date: string;
  start_date_local: string;
  timezone: Timezone;
  utc_offset: number;
  location_city: null;
  location_state: null;
  location_country: LocationCountry;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: Map;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: Visibility;
  flagged: boolean;
  gear_id: null;
  start_latlng: number[];
  end_latlng: number[];
  average_speed: number;
  max_speed: number;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high: number;
  elev_low: number;
  upload_id: number;
  upload_id_str: string;
  external_id: null | string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score?: number;
  workout_type?: number | null;
  average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
}

export type Athlete = {
  id: number;
  resource_state: number;
}

export type LocationCountry = "Italy" | string;

export type Map = {
  id: string;
  summary_polyline: string;
  resource_state: number;
}

export type Type = "Walk" | "Run" | "Ride" | string;

export type Timezone = | string;

export type Visibility = "followers_only" | "everyone";
