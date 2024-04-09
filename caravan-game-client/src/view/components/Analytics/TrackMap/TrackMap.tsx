/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';

import { Track } from '@model/activity';
import { TrackerDetails } from '@model/trackerDetails';

import { finishSvg, mapConfig, startSvg } from '../consts';
import { Boundaries } from '../model';

type Path = { lat: number; lng: number };

type Props = {
  track: Track;
  decodedMap: Path[] | null;
  trackerDetails: TrackerDetails | null;
  setFullscreen: (isFullscreen: boolean) => void;
  selectedBoundaries: Boundaries | null;
  fullscreen: boolean;
};
export const TrackMap = observer(function Map(props: Props) {
  const { track, fullscreen, decodedMap, trackerDetails, selectedBoundaries } = props;
  const [map, setMap] = useState<H.Map | null>(null);
  const [selectedRouteObjectID, setSelectedRouteObjectID] = useState(null);
  // создание карты и ее запись в стэйт
  const mRef = useCallback<(el: Element | null) => void>(mapRef => {
    if (!mapRef || map) {
      return;
    }

    const platform = new H.service.Platform({
      apikey: mapConfig.apikey,
      useCIT: true,
      useHTTPS: true,
    });
    const defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    const mp = new H.Map(mapRef, defaultLayers.vector.normal.map);
    setMap(mp);

    if (mapConfig.interactive) {
      // eslint-disable-next-line no-new
      new H.mapevents.Behavior(new H.mapevents.MapEvents(mp));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // добавление основных объектов карты
  useEffect(() => {
    if (!map) {
      return;
    }
    const points = decodedMap ?? trackerDetails?.points ?? null;

    if (!points) {
      return;
    }

    const routeLines: H.geo.LineString[] = [];
    const linkLines: H.geo.LineString[] = [];
    let segment: number | null = null;
    let linkStart: H.geo.Point | null = null;

    // eslint-disable-next-line func-names
    points.forEach(function (point) {
      // @ts-ignore dsfsds
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const pointSegment: number = point.segment ? point.segment : 1;

      // установить первый сегмент
      if (segment === null) {
        segment = pointSegment;
      }

      // сдвигать начало связки пока не закончится сегмент
      if (pointSegment === segment) {
        // @ts-ignore dsfsds
        linkStart = point;
      }

      // установить окончание связки на начало нового сегмента
      if (pointSegment > segment && linkStart) {
        linkLines[segment] = new H.geo.LineString();
        linkLines[segment].insertPoint(0, linkStart);
        linkLines[segment].insertPoint(1, point);
        segment = pointSegment;
      }

      if (!routeLines[pointSegment]) {
        routeLines[pointSegment] = new H.geo.LineString();
      }
      routeLines[pointSegment].pushPoint(point);
    });

    const routeMultiline = new H.geo.MultiLineString(routeLines.filter(line => line != null));
    const route = new H.map.Polyline(routeMultiline, {
      style: { lineWidth: 6, strokeColor: 'red', lineJoin: 'bevel' },
    });
    map.addObject(route);

    map.getViewModel().setLookAtData({
      bounds: route.getBoundingBox(),
    });

    if (linkLines.length > 0) {
      const linksMultiline = new H.geo.MultiLineString(linkLines.filter(line => line));
      const links = new H.map.Polyline(linksMultiline, {
        style: { lineWidth: 1, lineDash: [1, 5], strokeColor: 'red' },
        arrows: { fillColor: 'white', frequency: 4, width: 0.8, length: 0.7 },
      });
      map.addObject(links);
    }

    const startIcon = new H.map.Icon(startSvg);
    const startCoords = points[0];
    const startMarker = new H.map.Marker(startCoords, { icon: startIcon });

    const finishIcon = new H.map.Icon(finishSvg);
    const finishCoords = points[points.length - 1];
    const finishMarker = new H.map.Marker(finishCoords, { icon: finishIcon });

    map.addObject(finishMarker);
    map.addObject(startMarker);
  }, [map, trackerDetails, decodedMap]);

  useEffect(() => {
    if (map && selectedBoundaries && trackerDetails?.points) {
      const linestring = new H.geo.LineString();

      if (selectedBoundaries[0] === selectedBoundaries[1]) {
        return;
      }

      const selectedSegment = trackerDetails.points.slice(
        selectedBoundaries[0],
        selectedBoundaries[1] + 1,
      );
      selectedSegment.forEach(function addPoint(point) {
        linestring.pushPoint(point);
      });

      // Initialize a polyline with the linestring:
      const route = new H.map.Polyline(linestring, {
        style: { lineWidth: 6, strokeColor: 'green' },
        arrows: { fillColor: 'white', frequency: 4, width: 0.8, length: 0.7 },
      });

      if (selectedRouteObjectID) {
        const obj = map.getObjects().find(rr => rr.getId() === selectedRouteObjectID);
        if (!obj) {
          throw new Error('Obj not found: ');
        }
        map.removeObject(obj);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setSelectedRouteObjectID(route.getId());
      // Add the polyline to the map:
      map.addObject(route);
    }
    // if (map && !selectedBoundaries && selectedRouteObjectID) {
    //   const obj = map.getObjects().find(ff => ff.getId() === selectedRouteObjectID);
    //   map.removeObject(obj);
    //   setSelectedRouteObjectID(null);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, selectedBoundaries]);

  return (
    <div className={`track__mapValues ${fullscreen ? 'track__mapValues-full' : ''}`}>
      {!track && (
        <div
          className="card-body d-flex text-center bg-white border-bottom border-5 align-items-center justify-content-center"
          style={{ height: 500, position: 'relative' }}
        >
          <div className="skeleton" />
        </div>
      )}
      {track && <div ref={mRef} className={`track__map ${fullscreen ? 'track__map-full' : ''}`} />}
    </div>
  );
});
