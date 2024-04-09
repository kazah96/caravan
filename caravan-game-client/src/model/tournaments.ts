export type TournamentResponse = {
  status: string;
  data: TournamentData;
};
export type TournamentData = {
  totalPages: number;
  items?: Tournament[] | null;
};
export type Tournament = {
  id: number;
  name: string;
  description: string;
  photo_id: number;
  mobile_photo_id: number;
  date_start: string;
  date_end: string;
  created_by_id: number;
  register_till: string;
  created_at: string;
  price: number;
  price_tip: string;
  btl?: number | null;
  btlpt?: number | null;
  status: number;
  status_text: string;
  accepts_results: boolean;
  btbf: number;
  stats: Stats;
  qgroups_quantity: number;
  access: number;
  access_region: number;
  access_message: string;
  auto_membership_date?: null;
  position: number;
  standing: Standing;
  standings: Standing[];
  rating_segments: number[];
  rating_periods?: (number | null)[] | null;
  icons?: null[] | null;
  isPrivateEvent: boolean;
  isOpenedForParticipation: boolean;
  isParticipatedBy: boolean;
  isModeratedBy: boolean;
  likesCount: number;
  likes?: (string | null)[] | null;
  liked: boolean;
  commentsCount: number;
  originalPhotoUrl?: string | null;
  mobilePhotoUrl?: string | null;
  team_size?: number | null;
  teams?: Team[];
  members_snippet?: null[] | null;
};
export type Stats = {
  fansQuantity?: number | null;
  maleQuantity: number;
  likesQuantity: number;
  femaleQuantity: number;
  membersQuantity: number;
  reviewsQuantity: number;
  teamMembersQuantity: number;
  perforatingReviewsQuantity: number;
};
export type Standing = {
  aims: any;
  pause: any;
  aim_id: string;
  bonuses?: any | null[] | null;
  moderation?: any | null;
  time_of_day?: any | null;
  allow_manual?: string | null;
  import_delay?: string | null;
  allow_bonuses?: string | null;
  unstand_dupes?: string | null;
  ratios?: any | null;
};

export type Team = {
  id: number;
  name: string;
  league_id: number;
  captain?: null;
  members_snippet?: MembersSnippetEntity[] | null;
  members_count: number;
  photo?: null;
};

export type MembersSnippetEntity = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string | null;
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
export type Rating = {
  place: number;
  points: string;
};
export type Location = {
  country: Country;
  city: City;
  city_region?: CityRegion | null;
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
export type CityRegion = {
  id: number;
  city_id: number;
  city_ad_id: number;
  name: string;
  full_name: string;
};
