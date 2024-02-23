import { bigint, date, integer, pgTable, real, serial, varchar } from 'drizzle-orm/pg-core';



export const workouts = pgTable('strava_workouts', {
  id: serial('id').primaryKey(),
  strava_id: bigint('strava_id', { mode: 'bigint' }).unique(),
  name: varchar('name', { length: 256 }),
  distance: real('distance'),
  moving_time: integer('moving_time'),
  elapsed_time: integer('elapsed_time'),
  total_elevation_gain: real('total_elevation_gain'),
  type: varchar('type', { length: 256 }),
  sport_type: varchar('sport_type', { length: 256 }),
  start_date: date('start_date'),
  start_date_local: date('start_date_local'),
  timezone: varchar('timezone', { length: 256 }),
  // utc_offset: integer('utc_offset'),
  location_city: varchar('location_city', { length: 256 }),
  location_state: varchar('location_state', { length: 256 }),
  location_country: varchar('location_country', { length: 256 }),
  achievement_count: integer('achievement_count'),
  // kudos_count: integer('kudos_count'),
  // comment_count: integer('comment_count'),
  // athlete_count: integer('athlete_count'),
  // photo_count: integer('photo_count'),
  // trainer: integer('trainer'),
  // commute: integer('commute'),
  // manual: integer('manual'),
  // private: integer('private'),
  // visibility: varchar('visibility', { length: 256 }),
  // flagged: integer('flagged'),
  // start_latlng: integer('start_latlng'),
  // end_latlng: integer('end_latlng'),
  average_speed: real('average_speed'),
  max_speed: real('max_speed'),
  // has_heartrate: integer('has_heartrate'),
  average_heartrate: real('average_heartrate'),
  max_heartrate: real('max_heartrate'),
  // heartrate_opt_out: integer('heartrate_opt_out'),
  // display_hide_heartrate_option: integer('display_hide_heartrate_option'),
  // elev_high: real('elev_high'),
  // elev_low: real('elev_low'),
  // upload_id: integer('upload_id'),
  // upload_id_str: varchar('upload_id_str', { length: 256 }),
  // external_id: varchar('external_id', { length: 256 }),
  // from_accepted_tag: integer('from_accepted_tag'),
  // pr_count: integer('pr_count'),
  // total_photo_count: integer('total_photo_count'),
  // has_kudoed: integer('has_kudoed'),
  suffer_score: integer('suffer_score'),
  // workout_type: integer('workout_type'),
  average_watts: real('average_watts'),
  // kilojoules: integer('kilojoules'),
  // device_watts: integer('device_watts'),


});






