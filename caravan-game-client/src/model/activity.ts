import { Meta } from './common';

export type ActivityResponse = {
  meta: Meta;
  items: Activity[];
};
export type Activity = {
  event_id: number;
  extra: Extra;
  standing: Standing;
  track: Track;
  member: Member;
};
type Member = {
  joined_at: string;
  qgroup: number;
  team_id?: number;
  results: Results;
};
type Results = {
  score: number;
  steps: number;
  distance: number;
  moving_time: number;
  distanceForQGroup: number;
  total_elevation_gain: number;
};

export type Track = {
  id: number;
  tracker: Tracker;
  user: User;
  sport_id: number;
  external_id: string;
  external_url?: string;
  created_at: string;
  updated_at: string;
  start_date: string;
  start_date_local: string;
  start_date_user: string;
  name: string;
  description?: string;
  distance: number;
  steps: number;
  total_elevation_gain: number;
  average_heartrate: number;
  moving_time: number;
  elev_high: number;
  elev_low: number;
  route?: string;
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
  image?: string;
  files: string[];
  likesCount: number;
  commentsCount: number;
  complaintCount: number;
  liked: boolean;
  complained: boolean;
  activity_id?: string;
  os?: string;
};
type User = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string;
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
  sport_category: string;
};
type Location = {
  country: Country;
  city: City;
  city_region?: Cityregion;
};
type Cityregion = {
  id: number;
  city_id: number;
  city_ad_id: number;
  name: string;
  full_name: string;
};
type City = {
  id: number;
  country_id: number;
  country_code: string;
  region_id: number;
  name: string;
  full_name: string;
  has_regions: boolean;
};
type Country = {
  id: number;
  code: string;
  name: string;
};
type Rating = {
  place: number;
  points: string;
};
type Tracker = {
  id: number;
  tracker: string;
  created_at: string;
  updated_at: string;
  last_sync_time: string;
  last_error_id?: string;
  enabled: boolean;
};
type Standing = {
  distance: number;
  ratio: number;
  moving_time: number;
  pace?: string;
  score: string;
  standing: StandingStatus;
  criteria: Criteria;
};
type Criteria = {
  distance: Distance;
  pace: Pace;
  has_route: boolean;
  is_not_manual: boolean;
  import_delay: Importdelay;
  dupe_check: boolean;
  time_of_day: Pace;
};
type Importdelay = {
  min?: number;
  aim?: number;
  fact: number;
  stood: boolean;
};
type Pace = {
  min?: number;
  max?: number;
  aim?: number;
  fact: string;
  stood: boolean;
};
type Distance = {
  min?: number;
  aim?: number;
  fact: number;
  stood: boolean;
};
type StandingStatus = {
  stood: boolean;
  status: string;
  message?: string;
};
type Extra = {
  priority: number;
  avg_pace_event: string;
  event_memberships: number;
  cheater: boolean;
  checked: boolean;
  admin_comment_count: number;
  too_fast?: boolean;
  too_fast_limit: string;
  manual: boolean;
  gps: boolean;
  import_delay: boolean;
  edited: boolean;
};
