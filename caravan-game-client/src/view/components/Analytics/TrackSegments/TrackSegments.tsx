import { useCallback, useEffect, useState } from 'react';

import { useRootStore } from '@hooks/useRootStore';
import { Track } from '@model/activity';
import { TrackerDetails } from '@model/trackerDetails';

import { DEFAULT_SEGMENT_DIVIDERS } from '../consts';
import { Boundaries, Segment, SegmentDivider } from '../model';
import { Select } from './Select';

type Props = {
  track: Track;
  trackerDetails: TrackerDetails;
  selectedSegmentID: string | null;
  setSelectedSegmentID: (id: string | null) => void;
  selectedSegmentDivider: SegmentDivider;
  setSelectedSegmentDivider: (divider: SegmentDivider) => void;
  clearSelected: () => void;
  setSelectedBoundaries: (boundaries: Boundaries | null) => void;
};
export function TrackSegments(props: Props) {
  const {
    track,
    trackerDetails,
    clearSelected,
    selectedSegmentID,
    selectedSegmentDivider,
    setSelectedSegmentDivider,
    setSelectedBoundaries,
    setSelectedSegmentID,
  } = props;
  const { apiStore: ApiStore } = useRootStore();

  const [segments, setSegments] = useState<Segment[]>([]);

  // запрос отрезков при их изменении и при загрузке страницы
  useEffect(() => {
    if (track && selectedSegmentDivider?.distance && trackerDetails) {
      ApiStore.get<Segment[]>(
        `/track/${track.external_id}/analytics?interval=${selectedSegmentDivider.distance}`,
        undefined,
        { isTrackerApi: true },
      ).then(data => setSegments(data.data));
      clearSelected();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackerDetails, selectedSegmentDivider]);

  const onSegmentClick = useCallback(
    (seg: Segment, id: string) => {
      if (selectedSegmentID && id === selectedSegmentID) {
        clearSelected();
        return;
      }

      if (!trackerDetails.points) {
        throw new Error('No tracker points');
      }

      const startPointIndex = trackerDetails.points.findIndex(point => point.time === seg.start);
      const endPointIndex = trackerDetails.points.findIndex(point => point.time === seg.end);
      setSelectedSegmentID(id);
      setSelectedBoundaries([startPointIndex, endPointIndex]);
    },
    [
      selectedSegmentID,
      trackerDetails.points,
      setSelectedSegmentID,
      setSelectedBoundaries,
      clearSelected,
    ],
  );

  const dividerHandler = useCallback(
    (id: string) => {
      const divider = DEFAULT_SEGMENT_DIVIDERS.find(seg => seg.id === id);

      if (!divider) {
        throw new Error('No selected divider found');
      }

      setSelectedSegmentDivider(divider);

      if (id === 'disabled') {
        clearSelected();
      }
    },
    [clearSelected, setSelectedSegmentDivider],
  );

  return (
    <>
      <div className="track__segmentsHeader">
        <span className="track__header">Отрезки</span>
        <div className="track__controllers">
          <Select
            options={DEFAULT_SEGMENT_DIVIDERS}
            onChange={dividerHandler}
            selectedOption={selectedSegmentDivider}
          />
        </div>
      </div>
      {selectedSegmentDivider?.distance && segments && (
        <div className="track__segmentsTableWrapper">
          <table className="track__segmentsTable">
            <thead className="track__segmentsTable-thead">
              <tr>
                <th>№</th>
                <th>Длительность</th>
                <th>км</th>
                <th>Высота</th>

                <th>Темп</th>
              </tr>
            </thead>
            <tbody className="track__segmentsTable-tbody">
              {segments.map((seg, i) => (
                <tr
                  className={`segment${i}` === selectedSegmentID ? 'active' : ''}
                  key={seg.distance}
                  onClick={() => onSegmentClick(seg, `segment${i}`)}
                >
                  <td>{i + 1}</td>
                  <td>{seg.duration}</td>
                  <td>{Math.round(seg.distance / 10 + Number.EPSILON) / 100}</td>
                  <td>{`${seg.elevation} м`}</td>
                  <td>{seg.pace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
