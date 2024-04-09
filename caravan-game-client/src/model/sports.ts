export type SportsResponse = {
  data?: Sports[] | null;
};
export type Sports = {
  id: number;
  code: string;
  name: string;
  standing: Standing;
  pace_format: string;
  correct_factor: number;
  icon: string;
  photo?: null;
  cyclic: boolean;
  distances?: (DistancesEntity | null)[] | null;
};
export type Standing = {
  min_pace?: string | number;
  trackers: Trackers;
  min_distance?: string | number;
};
export type Trackers = {
  polar?: PolarOrStrava | null;
  google?: PolarOrGoogleOrStravaOrSuunto | null;
  strava?: PolarOrStrava1 | null;
  suunto?: PolarOrGoogleOrStravaOrSuunto1 | null[] | null;
};
export type PolarOrStrava = {
  types?: (TypesEntity | null)[] | null;
  text_types?: (TextTypesEntity | null)[] | null;
};
export type TypesEntity = {
  code: string;
  ratio: number;
  ratio_nogps: number;
};
export type TextTypesEntity = {
  text: string;
  type: string;
};
export type PolarOrGoogleOrStravaOrSuunto = {
  types?: TypesEntity1[] | null;
};
export type TypesEntity1 = {
  code: string;
  ratio: number;
  ratio_nogps: number;
};
export type PolarOrStrava1 = {
  types?: (TypesEntity | null)[] | null;
  text_types?: (TextTypesEntity | null)[] | null;
};
export type PolarOrGoogleOrStravaOrSuunto1 = {
  types?: TypesEntity1[] | null;
};
export type DistancesEntity = {
  id: number;
  name: string;
  distance: number;
};
