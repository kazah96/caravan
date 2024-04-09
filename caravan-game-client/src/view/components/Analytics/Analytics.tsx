import { observer } from 'mobx-react-lite';
import { Suspense, lazy, useEffect, useState } from 'react';

import { useRootStore } from '@hooks/useRootStore';
import { Track } from '@model/activity';
import { PointsEntity, TrackerDetails } from '@model/trackerDetails';

import { ChartSkeleton, MapSkeleton, SegmentsSkeleton } from './Skeletonts';
import { TrackMap } from './TrackMap/TrackMap';
import { TrackSegments } from './TrackSegments/TrackSegments';
import { DEFAULT_SEGMENT_DIVIDERS } from './consts';
import { Boundaries, Path, SegmentDivider, SegmentID } from './model';
import { decode, getDurationFromSeconds, getPaceByMeasure } from './utils';

type AnalyticsProps = {
  track: Track;
};

const TrackChartLazy = lazy(() => import('./TrackChart/TrackChart'));

const Analytics = observer(function Analytics(props: AnalyticsProps) {
  const debug = false;
  const { track } = props;

  const trackHasTrackerDetails = track.tracker.tracker === 'alivebe';
  const [fullscreen, setFullscreen] = useState(false);
  const [trackerDetails, setTrackerDetails] = useState<TrackerDetails | null>(null);
  const [isTrackerDetailsLoading, setTrackerDetailsLoading] = useState(false);
  const [decodedMap, setDecodedMap] = useState<Path[] | null>(null);
  const [selectedSegmentID, setSelectedSegmentID] = useState<SegmentID | null>(null);
  const [selectedBoundaries, setSelectedBoundaries] = useState<Boundaries | null>(null);
  const [selectedDivider, setSelectedDivider] = useState<SegmentDivider>(
    DEFAULT_SEGMENT_DIVIDERS[0],
  );
  const [errors, setErrors] = useState<string | null>(null);

  if (errors) {
    throw new Error(errors);
  }

  const {
    helperDataStore: { getSportByID },
    apiStore: ApiStore,
  } = useRootStore();

  const sport = getSportByID(track.sport_id);

  const getAlivebeTrackerDetails = async () => {
    const re = await ApiStore.get<TrackerDetails>(
      `/track/${track.external_id}?start=0&end=0`,
      undefined,
      { isTrackerApi: true },
    );
    const { data } = re;

    if (data.points?.length && data.points[0].time !== '0001-01-01T00:00:00Z') {
      const newPoints = data.points.map((p, _, a) => {
        // @ts-ignore dsfsd
        const durationInSeconds = Math.abs(new Date(p.time) - new Date(a[0].time)) / 1000;
        const distance = Math.round((p.distance / 1000 + Number.EPSILON) * 100) / 100;
        return {
          ...p,
          distance,
          pace: getPaceByMeasure(p.speed, sport?.pace_format ?? ''),
          duration: getDurationFromSeconds(durationInSeconds),
        } as unknown as PointsEntity;
      });
      return { ...data, points: newPoints };
    }
  };

  const getTrackerDetails = async () => {
    if (trackHasTrackerDetails && sport) {
      setTrackerDetailsLoading(true);
      const details = await getAlivebeTrackerDetails();

      setTrackerDetailsLoading(false);
      if (details) {
        setTrackerDetails(details);
        return;
      }
    }

    if (!track.route) {
      setErrors(`Track: ${track.id} has no route`);
    } else {
      setDecodedMap(decode(track.route));
    }
  };

  // запрос деталки по треку, если она доступна
  useEffect(() => {
    getTrackerDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`track__container ${fullscreen ? 'track__container-full' : ''}`}>
      <section className={`track__section overflow-hidden ${debug ? 'track__section-debug' : ''}`}>
        {track && (!!trackerDetails || !!decodedMap) ? (
          <TrackMap
            trackerDetails={trackerDetails}
            decodedMap={decodedMap}
            selectedBoundaries={selectedBoundaries}
            track={track}
            fullscreen={fullscreen}
            setFullscreen={b => setFullscreen(b)}
          />
        ) : (
          <MapSkeleton />
        )}
      </section>
      {trackHasTrackerDetails && (
        <section className="track__section">
          {isTrackerDetailsLoading && <SegmentsSkeleton />}
          {trackerDetails && (
            <TrackSegments
              track={track}
              trackerDetails={trackerDetails}
              selectedSegmentID={selectedSegmentID}
              clearSelected={clearSelected}
              selectedSegmentDivider={selectedDivider}
              setSelectedSegmentDivider={divider => setSelectedDivider(divider)}
              setSelectedSegmentID={segment => setSelectedSegmentID(segment)}
              setSelectedBoundaries={boundaries => setSelectedBoundaries(boundaries)}
            />
          )}
        </section>
      )}
      {trackHasTrackerDetails && (
        <Suspense>
          <section className="track__section">
            {isTrackerDetailsLoading && <ChartSkeleton />}
            {trackerDetails?.points && sport && (
              <TrackChartLazy
                points={trackerDetails.points}
                fullscreen={fullscreen}
                selectedDivider={selectedDivider}
                sport={sport}
                selectedBoundaries={selectedBoundaries}
                setSelectedSegmentID={segment => setSelectedSegmentID(segment)}
                setSelectedBoundaries={boundaries => setSelectedBoundaries(boundaries)}
              />
            )}
          </section>
        </Suspense>
      )}
    </div>
  );

  function clearSelected() {
    setSelectedSegmentID(null);
    setSelectedBoundaries(null);
  }
});

export { Analytics };
