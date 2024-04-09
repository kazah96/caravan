export type SegmentID = string;
export type Path = { lat: number; lng: number };

export type Boundaries = [number, number];
export type Segment = {
  duration: string;
  seconds: number;
  distance: number;
  heartrate: number;
  elevation: number;
  speed: number;
  pace: string;
  start: string;
  end: string;
};

export type SegmentDivider = {
  id: string;
  value: string;
  distance?: number;
};
