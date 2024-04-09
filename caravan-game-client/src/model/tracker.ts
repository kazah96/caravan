export type TrackerResponse = {
  data: TrackerData;
};

export type TrackerData = {
  id: number;
  tracker: Tracker;
  user: User;
  sport_id: number;
  external_id: string;
  external_url: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  start_date_local: string;
  start_date_user: string;
  name: string;
  description?: null;
  distance: number;
  steps?: null;
  total_elevation_gain: number;
  average_heartrate: number;
  moving_time: number;
  elev_high: number;
  elev_low: number;
  route: string;
  is_manual: boolean;
  end_date_local: string;
  has_dupes: boolean;
  flagged: boolean;
  max_pace: string;
  pace: string;
  elapsed_time: number;
  max_standing_distance: number;
  attached: boolean;
  stood: boolean;
  standing_status: string;
  image: string;
  files?: null[] | null;
  likesCount: number;
  commentsCount: number;
  complaintCount: number;
  liked: boolean;
  complained: boolean;
  activity_id?: null;
  os?: null;
};
export type Tracker = {
  id: number;
  tracker: string;
  created_at: string;
  updated_at: string;
  last_sync_time: string;
  last_error_id?: null;
  enabled: boolean;
};
export type User = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: null;
  last_online: string;
  age: number;
  date_of_birth: string;
  gender: string;
  isFriend: boolean;
  friendRequest: boolean;
  rating: Rating;
  awardCount: number;
  likeCount: number;
  friendCount: number;
  location: Location;
  sport_category?: null;
};
export type Rating = {
  place: number;
  points: string;
};
export type Location = {
  country: Country;
  city: City;
  city_region?: null;
};
export type Country = {
  id: number;
  code: string;
  name: string;
};
export type City = {
  id: number;
  country_id: number;
  country_code: string;
  region_id: number;
  name: string;
  full_name: string;
  has_regions: boolean;
};
