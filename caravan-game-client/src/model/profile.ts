export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
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
  friends?: null[] | null;
  location: Location;
  socials: Socials;
  approved: boolean;
  sport_category: string;
  email: string;
  email_confirm: boolean;
  phone: string;
  referral_link: string;
  settings: Settings;
  company: Company;
  shirt_size: string;
  timezone: string;
  language: string;
  distance_unit: string;
  bonuses: number;
  status: number;
  weight: number;
  height: number;
  roles?: string[] | null;
};
export type Rating = {
  place: number;
  points: string;
};
export type Location = {
  country: Country;
  city: City;
  city_region: CityRegion;
  address: string;
  postcode: string;
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
export type Socials = {
  facebook: FacebookOrGoogle;
  google: FacebookOrGoogle;
};
export type FacebookOrGoogle = {
  id: number;
  user_id: number;
  source: string;
  source_id: string;
  primary: boolean;
};
export type Settings = {
  'event.price-free-auto-membership': boolean;
  'privacy.hide-routes': boolean;
  'general.request-approved': boolean;
  'general.receive-news': boolean;
  'general.gps-enable': boolean;
  'rating.own-at-top': boolean;
};
export type Company = {
  company: Company1;
  subdivision: Subdivision;
  personnel_number: string;
};
export type Company1 = {
  id: number;
  name: string;
  description: string;
  sites?: null[] | null;
  phones?: null[] | null;
  addresses?: null[] | null;
  type_id: number;
  typeName: string;
  position: number;
  photoUrl?: null;
};
export type Subdivision = {
  id: number;
  name: string;
};
