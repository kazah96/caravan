import { Sports } from '@model/sports';
import { PointsEntity } from '@model/trackerDetails';
import { Boundaries, SegmentDivider } from '../model';
import { Chart } from './Chart';

export type ChartDataItem = {
  id: number;
  time: string;
  distance: number;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  pace: number;
  steps: number;
  accuracy: number;
};

type Props = {
  points: PointsEntity[];
  setSelectedBoundaries: (boundaries: Boundaries | null) => void;
  selectedDivider: SegmentDivider;
  setSelectedSegmentID: (id: string | null) => void;
  selectedBoundaries: Boundaries | null;
  fullscreen: boolean;
  sport: Sports;
};
export default function TrackChart(props: Props) {
  const {
    fullscreen,
    points,
    selectedBoundaries,
    setSelectedBoundaries,
    setSelectedSegmentID,
    selectedDivider,
    sport,
  } = props;

  return (
    <div className={`track__container ${fullscreen ? 'track__container-full' : ''}`}>
      <Chart
        initialData={points as unknown as ChartDataItem[]}
        selectedBoundaries={selectedBoundaries}
        setSelectedBoundaries={(e: Boundaries) => {
          setSelectedBoundaries(e);
          setSelectedSegmentID(null);
        }}
        paceFormat={sport?.pace_format || ''}
        selectedDivider={selectedDivider}
      />
    </div>
  );
}
