import { Meta } from './common';

export type CommentsResponse = {
  meta: Meta;
  items: Comment[];
};

export type Comment = {
  id: number;
  created_at: string;
  content: string;
  user: User;
};
export type User = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar: string;
  age: number;
  gender: string;
  last_online: string;
  sport_category: string;
  location: Location;
};
export type Location = {
  country: Country;
  city: City;
  city_region: CityRegion;
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
